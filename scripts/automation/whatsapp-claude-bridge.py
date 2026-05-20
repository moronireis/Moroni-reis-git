from __future__ import annotations

import asyncio
import json
import logging
import os
from datetime import datetime

import httpx
import uvicorn
from fastapi import FastAPI, Request

# --- Configuration ---
EVOLUTION_BASE = "https://weirdpigeon-evolution.cloudfy.live"
EVOLUTION_INSTANCE = "Reis"
EVOLUTION_API_KEY = "tqXOKoUIAH0llngaxg9k2dYnx5CpHrnp"
CLAUDE_WORKING_DIR = "/Users/moronireis/Projetos vscode"
CLAUDE_TIMEOUT = None  # no timeout — wait as long as needed
MAX_MSG_LENGTH = 4000
PORT = 3456
SIDECAR_URL = "http://localhost:3457"

# --- Allowed Users ---
# To add a new user, add their phone number as key.
# Options:
#   name: display name for logs
#   cwd: working directory for Claude
#   lid: WhatsApp LID (if they show up as @lid instead of @s.whatsapp.net)
#   confirm_flow: if True, buffer messages 4s, summarize, ask confirmation before executing
#   system_prompt: prepended to every message sent to Claude for this user
USERS = {
    "5511967615987": {
        "name": "Moroni",
        "cwd": CLAUDE_WORKING_DIR,
        "confirm_flow": False,
        "system_prompt": None,
    },
    "5511963341710": {
        "name": "Daphine",
        "cwd": "/Users/moronireis/Projetos vscode/daphine-portfolio",
        "confirm_flow": True,
        "system_prompt": (
            "Voce esta ajudando a Daphine Oliveira a editar seu portfolio de artista. "
            "O projeto esta em /Users/moronireis/Projetos vscode/daphine-portfolio/. "
            "E um arquivo HTML single-page: index.html. "
            "Design System: Cream #FAF6F1, Beige #F0E6D8, Caramel #C4A882, Dusty Rose #C9A89A, "
            "Brown Dark #3D2B1F, Brown Mid #6B5744. "
            "Fonts: Cormorant Garamond (headings), Inter (body). Light mode.\n"
            "Responda sempre em portugues brasileiro. "
            "Quando ela pedir mudancas, edite o index.html diretamente. "
            "IMPORTANTE: Apos QUALQUER alteracao, faca deploy com: "
            "cd '/Users/moronireis/Projetos vscode/daphine-portfolio' && npx vercel --prod --yes. "
            "Confirme o que foi feito e envie o link do site atualizado."
        ),
    },
    "5511978478413": {
        "name": "Thales",
        "cwd": "/Users/moronireis/Projetos vscode/noiva-sa-platform",
        "confirm_flow": True,
        "system_prompt": (
            "Voce e o assistente pessoal do Moroni Reis, e esta ajudando o Thales nos projetos da Noiva S.A. "
            "Voce tem acesso completo a todos os projetos e arquivos.\n\n"
            "PROJETOS NOIVA S.A.:\n"
            "1. noiva-sa-platform/ — Plataforma principal (apresentacao, diagnostico, quiz, brandbook, design system)\n"
            "   - assessoria-sa-apresentacao.html — Apresentacao interativa de vendas (27 slides)\n"
            "   - raio-x-sa.html — Diagnostico interativo Raio-X SA (quiz sliders)\n"
            "   - diagnostico-sa.html — Diagnostico SA\n"
            "   - quiz-quanto-custa.html — Quiz visual 'Quanto Custa Casar?' (lead magnet)\n"
            "   - brandbook/ — Brandbook interativo completo (18 secoes)\n"
            "   - design-system/ — Design system da marca\n"
            "2. noiva-sa-competitors/ — Analise de concorrentes\n"
            "3. noivasa-ads-pitch/ — Pitch de anuncios\n\n"
            "DESIGN SYSTEM: Rose #DBA99F, Blush #FFCBC1, Cream #F4F3EE, Eucalyptus #4A6741, Taupe #9C958F. "
            "Fonts: Cormorant Garamond (headlines), Montserrat (UI), Source Sans 3 (body), Great Vibes (accent). "
            "Dark mode (#0a0a0a).\n\n"
            "MARCA: Noiva S.A. = Sociedade do Amor. Simbolo: Alianca Entrecruzada. "
            "Sub-marcas: Assessoria, Mentoria, Conexoes, Gestao. "
            "Pacotes: Inicio (~R$3.100), Completa (~R$4.500), Exclusiva (~R$7.500).\n\n"
            "URLs LIVE:\n"
            "- Brandbook: https://brandbook-rose.vercel.app\n"
            "- Design System: https://design-system-roan-nine.vercel.app\n\n"
            "Responda sempre em portugues brasileiro. "
            "Quando pedirem mudancas, edite os arquivos diretamente. "
            "IMPORTANTE: Apos QUALQUER alteracao, faca deploy com: "
            "cd '<diretorio_do_projeto>' && npx vercel --prod --yes. "
            "Confirme o que foi feito e envie o link atualizado. "
            "SEMPRE confirme com o Thales antes de executar qualquer alteracao."
        ),
    },
}

# --- Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("bridge")

# --- App State ---
app = FastAPI()

# Per-user state stored here
# Keys created dynamically:
#   session_{name}: bool - whether --continue should be used
#   processing_{name}: bool - whether Claude is running for this user
user_state = {}
# Per-user message buffer for confirm flow
msg_buffer = {}
# Per-user pending confirmation
pending_confirm = {}

started_at = datetime.now()
total_processed = 0


# --- Helpers ---

def extract_message(data: dict) -> tuple[str | None, str | None, bool]:
    """Extract (text, sender_jid, from_me) from Evolution webhook payload."""
    msg_data = data.get("data", data)
    key = msg_data.get("key", {})
    jid = key.get("remoteJid", "")
    from_me = key.get("fromMe", True)
    message = msg_data.get("message", {})
    text = (
        message.get("conversation")
        or message.get("extendedTextMessage", {}).get("text")
        or message.get("imageMessage", {}).get("caption")
        or message.get("videoMessage", {}).get("caption")
        or message.get("documentWithCaptionMessage", {}).get("message", {}).get("imageMessage", {}).get("caption")
    )
    # If image/video with no caption, acknowledge receipt
    if not text and any(k in message for k in ("imageMessage", "videoMessage")):
        text = "[Usuário enviou uma imagem/vídeo sem legenda. Pergunte o que deseja fazer com ela.]"
    return text, jid, from_me


def get_user(jid: str) -> dict | None:
    """Return user config if allowed, None otherwise."""
    if not jid:
        return None
    number = jid.split("@")[0]
    if number in USERS:
        return USERS[number]
    for user in USERS.values():
        if user.get("lid") == number:
            return user
    return None


async def send_whatsapp(jid: str, text: str):
    """Send a message back via Evolution API. Auto-splits long messages."""
    url = f"{EVOLUTION_BASE}/message/sendText/{EVOLUTION_INSTANCE}"
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}

    chunks = []
    while text:
        if len(text) <= MAX_MSG_LENGTH:
            chunks.append(text)
            break
        split_at = text.rfind("\n", 0, MAX_MSG_LENGTH)
        if split_at == -1 or split_at < MAX_MSG_LENGTH // 2:
            split_at = text.rfind(" ", 0, MAX_MSG_LENGTH)
        if split_at == -1:
            split_at = MAX_MSG_LENGTH
        chunks.append(text[:split_at])
        text = text[split_at:].lstrip()

    async with httpx.AsyncClient(timeout=30) as client:
        for i, chunk in enumerate(chunks):
            try:
                resp = await client.post(url, headers=headers, json={"number": jid, "text": chunk})
                log.info(f"Sent chunk {i+1}/{len(chunks)} ({len(chunk)} chars) -> {resp.status_code}")
            except Exception as e:
                log.error(f"Failed to send chunk {i+1}: {e}")
            if i < len(chunks) - 1:
                await asyncio.sleep(1)


async def run_claude(message: str, user: dict) -> str:
    """Send message to Claude via persistent sidecar session."""
    uname = user["name"]

    log.info(f"[{uname}] Sending to sidecar...")

    try:
        payload = {
            "message": message,
            "user": uname,
            "cwd": user.get("cwd", CLAUDE_WORKING_DIR),
        }
        if user.get("system_prompt"):
            payload["systemPrompt"] = user["system_prompt"]

        async with httpx.AsyncClient(timeout=CLAUDE_TIMEOUT) as client:
            resp = await client.post(
                f"{SIDECAR_URL}/message",
                json=payload,
            )

        if resp.status_code != 200:
            error = resp.json().get("error", resp.text)
            log.error(f"[{uname}] Sidecar error {resp.status_code}: {error}")
            return f"[Erro no sidecar - {resp.status_code}]\n{str(error)[:500]}"

        data = resp.json()
        response = data.get("response", "")
        cost = data.get("cost")
        usage = data.get("usage")

        if cost is not None:
            log.info(f"[{uname}] Cost: ${cost:.4f} | Usage: {json.dumps(usage or {})}")

        if not response:
            return "[Claude retornou resposta vazia]"

        return response

    except httpx.TimeoutException:
        log.error(f"[{uname}] Sidecar timed out")
        return "[Timeout - sidecar nao respondeu]"
    except httpx.ConnectError:
        log.error(f"[{uname}] Sidecar not running at {SIDECAR_URL}")
        return "[Erro: sidecar nao esta rodando. Inicie com: cd claude-sidecar && node server.js]"
    except Exception as e:
        log.error(f"[{uname}] Sidecar error: {e}")
        return f"[Erro: {str(e)[:200]}]"


MSG_BUFFER_SECONDS = 5  # Wait this long after last message before processing

async def process_message(text: str, jid: str, user: dict):
    """Process a combined message through Claude and send response."""
    global total_processed
    uname = user["name"]
    lock_key = f"processing_{uname}"

    user_state[lock_key] = True
    try:
        await send_whatsapp(jid, "[Processando...]")
        response = await run_claude(text, user)
        await send_whatsapp(jid, response)
        total_processed += 1
        log.info(f"[{uname}] Response sent ({len(response)} chars)")
    except Exception as e:
        log.error(f"[{uname}] Error: {e}")
        await send_whatsapp(jid, f"[Erro: {str(e)[:200]}]")
    finally:
        user_state[lock_key] = False


def buffer_and_process(text: str, jid: str, user: dict):
    """Buffer messages for MSG_BUFFER_SECONDS, then process all at once."""
    uname = user["name"]

    # If Claude is already processing for this user, queue the message
    if user_state.get(f"processing_{uname}"):
        if uname not in msg_buffer:
            msg_buffer[uname] = {"messages": [], "jid": jid}
        msg_buffer[uname]["messages"].append(text)
        msg_buffer[uname]["jid"] = jid
        log.info(f"[{uname}] Queued while processing: \"{text[:60]}\"")
        return

    # Add to buffer
    if uname not in msg_buffer:
        msg_buffer[uname] = {"messages": [], "jid": jid}
    msg_buffer[uname]["messages"].append(text)
    msg_buffer[uname]["jid"] = jid

    # Cancel previous timer if exists
    if "task" in msg_buffer[uname] and not msg_buffer[uname]["task"].done():
        msg_buffer[uname]["task"].cancel()

    # New timer: wait MSG_BUFFER_SECONDS then flush
    async def flush(u=uname, j=jid, usr=user):
        await asyncio.sleep(MSG_BUFFER_SECONDS)
        buf = msg_buffer.pop(u, None)
        if not buf or not buf["messages"]:
            return
        combined = "\n".join(buf["messages"])
        log.info(f"[{u}] Buffer flushed: {len(buf['messages'])} msgs, {len(combined)} chars")
        await process_message(combined, buf["jid"], usr)

    msg_buffer[uname]["task"] = asyncio.create_task(flush())
    log.info(f"[{uname}] Buffered ({len(msg_buffer[uname]['messages'])} msgs, waiting {MSG_BUFFER_SECONDS}s)")


async def process_with_confirm(text: str, jid: str, user: dict):
    """Confirm flow: buffer 4s, summarize, wait for yes/no, then execute."""
    global total_processed
    uname = user["name"]
    lock_key = f"processing_{uname}"

    if user_state.get(lock_key):
        await send_whatsapp(jid, "[Ainda processando. Aguarde.]")
        return

    user_state[lock_key] = True
    try:
        await send_whatsapp(jid, "[Criando...]")
        response = await run_claude(text, user)
        await send_whatsapp(jid, response)
        total_processed += 1
        log.info(f"[{uname}] Confirmed & sent ({len(response)} chars)")
    except Exception as e:
        log.error(f"[{uname}] Error: {e}")
        await send_whatsapp(jid, f"[Erro: {str(e)[:200]}]")
    finally:
        user_state[lock_key] = False


# --- Routes ---

@app.get("/")
async def health():
    uptime = datetime.now() - started_at
    return {
        "status": "running",
        "uptime": str(uptime).split(".")[0],
        "messages_processed": total_processed,
        "users": list(USERS.keys()),
        "sessions": {k: v for k, v in user_state.items() if k.startswith("session_")},
    }


@app.post("/webhook")
async def webhook(request: Request):
    try:
        body = await request.json()
    except Exception:
        return {"status": "invalid json"}

    event = body.get("event", "")
    if event != "messages.upsert":
        return {"status": "ignored", "reason": f"event: {event}"}

    text, jid, from_me = extract_message(body)

    if from_me:
        return {"status": "ignored", "reason": "from_me"}
    if not text:
        return {"status": "ignored", "reason": "no text"}
    if "@g.us" in (jid or ""):
        return {"status": "ignored", "reason": "group"}

    user = get_user(jid)
    if not user:
        log.warning(f"Blocked: {jid}")
        return {"status": "ignored", "reason": "unauthorized"}

    uname = user["name"]
    cmd = text.strip().lower()
    log.info(f"[{uname}] \"{text[:100]}\"")

    # --- Special commands ---
    if cmd in ("/new", "nova conversa", "/nova"):
        user_state[f"session_{uname}"] = False
        pending_confirm.pop(uname, None)
        buf = msg_buffer.pop(uname, None)
        if buf and "task" in buf and not buf["task"].done():
            buf["task"].cancel()
        # Reset sidecar session for this user
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                await client.post(f"{SIDECAR_URL}/reset", json={"user": uname})
        except Exception:
            pass
        await send_whatsapp(jid, "Sessao resetada. Proxima mensagem inicia conversa nova.")
        return {"status": "reset"}

    if cmd in ("/opus", "/sonnet"):
        model = "claude-opus-4-6" if cmd == "/opus" else "claude-sonnet-4-6"
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                await client.post(f"{SIDECAR_URL}/model", json={"model": model, "user": uname})
        except Exception:
            pass
        label = "Opus" if cmd == "/opus" else "Sonnet"
        await send_whatsapp(jid, f"Modelo trocado para {label}. Proxima mensagem inicia sessao nova.")
        return {"status": "model_changed"}

    if cmd == "/status":
        uptime = datetime.now() - started_at
        is_processing = "sim" if user_state.get("processing_" + uname) else "nao"
        # Check sidecar
        sidecar_status = "offline"
        try:
            async with httpx.AsyncClient(timeout=3) as client:
                sr = await client.get(f"{SIDECAR_URL}/")
                if sr.status_code == 200:
                    sd = sr.json()
                    sidecar_status = f"online (sessao: {'ativa' if sd.get('hasSession') else 'nenhuma'})"
        except Exception:
            pass
        await send_whatsapp(jid, (
            f"Bridge ativo\n"
            f"Uptime: {str(uptime).split('.')[0]}\n"
            f"Total mensagens: {total_processed}\n"
            f"Sidecar: {sidecar_status}\n"
            f"Processando: {is_processing}"
        ))
        return {"status": "status_sent"}

    # --- Confirm flow ---
    if user.get("confirm_flow"):
        # User is confirming a pending request
        if uname in pending_confirm:
            if cmd in ("sim", "yes", "pode", "ok", "prossiga", "vai", "faz", "pode sim", "sim!", "s"):
                request_text = pending_confirm.pop(uname)
                asyncio.create_task(process_with_confirm(request_text, jid, user))
                return {"status": "confirmed"}
            elif cmd in ("nao", "no", "cancela", "nao quero", "para", "n"):
                pending_confirm.pop(uname)
                await send_whatsapp(jid, "Ok, cancelado. Me diga o que deseja fazer.")
                return {"status": "cancelled"}
            else:
                # New message replaces pending, fall through to buffer
                pending_confirm.pop(uname)

        # Buffer messages for 4 seconds
        if uname not in msg_buffer:
            msg_buffer[uname] = {"messages": [], "jid": jid}

        msg_buffer[uname]["messages"].append(text)
        msg_buffer[uname]["jid"] = jid

        # Cancel previous timer
        if "task" in msg_buffer[uname] and not msg_buffer[uname]["task"].done():
            msg_buffer[uname]["task"].cancel()

        async def flush_buffer(u=uname, j=jid, usr=user):
            await asyncio.sleep(4)
            buf = msg_buffer.pop(u, None)
            if not buf or not buf["messages"]:
                return
            combined = "\n".join(buf["messages"])
            log.info(f"[{u}] Buffer flushed: {len(buf['messages'])} messages")

            summary_prompt = (
                f"O usuario enviou estas mensagens pedindo alteracoes:\n\n"
                f"{combined}\n\n"
                f"Resuma em bullet points curtos o que o usuario quer. "
                f"NAO faca nenhuma alteracao. Apenas liste o que entendeu. "
                f"Responda em portugues, direto, sem introducao."
            )
            summary = await run_claude(summary_prompt, usr)
            pending_confirm[u] = combined
            await send_whatsapp(buf["jid"], f"Entendi o seguinte:\n\n{summary}\n\nPosso prosseguir?")

        msg_buffer[uname]["task"] = asyncio.create_task(flush_buffer())
        return {"status": "buffered"}

    # --- Direct flow (with 5s buffer to collect multiple messages) ---
    buffer_and_process(text, jid, user)
    return {"status": "buffered"}


# --- Tunnel + Webhook Auto-Setup ---

CLOUDFLARED_PATH = os.path.expanduser("~/.local/bin/cloudflared")

async def start_tunnel_and_update_webhook():
    """Start cloudflared tunnel, parse URL, update Evolution webhook."""
    log.info("Starting cloudflared tunnel...")

    proc = await asyncio.create_subprocess_exec(
        CLOUDFLARED_PATH, "tunnel", "--url", f"http://localhost:{PORT}",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    # cloudflared prints the URL to stderr
    tunnel_url = None
    while True:
        line = await proc.stderr.readline()
        if not line:
            break
        text = line.decode().strip()
        if "trycloudflare.com" in text:
            # Extract URL
            import re
            match = re.search(r"(https://[a-z0-9-]+\.trycloudflare\.com)", text)
            if match:
                tunnel_url = match.group(1)
                log.info(f"Tunnel URL: {tunnel_url}")
                break

    if not tunnel_url:
        log.error("Failed to get tunnel URL!")
        return None

    # Update Evolution webhook
    webhook_url = f"{tunnel_url}/webhook"
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            f"{EVOLUTION_BASE}/webhook/set/{EVOLUTION_INSTANCE}",
            headers={"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"},
            json={
                "webhook": {
                    "url": webhook_url,
                    "enabled": True,
                    "webhook_by_events": False,
                    "webhook_base64": False,
                    "events": ["MESSAGES_UPSERT"],
                }
            },
        )
        if resp.status_code in (200, 201):
            log.info(f"Webhook updated: {webhook_url}")
        else:
            log.error(f"Webhook update failed: {resp.status_code} {resp.text}")

    # Keep reading stderr so cloudflared doesn't block
    async def drain():
        async for line in proc.stderr:
            pass
    asyncio.create_task(drain())

    return tunnel_url


@app.on_event("startup")
async def on_startup():
    url = await start_tunnel_and_update_webhook()
    if url:
        print(f"\n  Tunnel: {url}")
        print(f"  Webhook: {url}/webhook")
        print(f"  Tudo pronto. Mande mensagem pelo WhatsApp.\n")
    else:
        print("\n  AVISO: Tunnel falhou. Webhook nao atualizado.\n")


# --- Startup ---

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  WHATSAPP <-> CLAUDE CODE BRIDGE")
    print("=" * 60)
    for number, u in USERS.items():
        confirm = " [confirm]" if u.get("confirm_flow") else ""
        print(f"  {u['name']}: {number} -> {u['cwd']}{confirm}")
    print(f"\n  Porta: {PORT}")
    print(f"  Comandos: /new, /status, /opus, /sonnet")
    print("=" * 60)

    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="warning")
