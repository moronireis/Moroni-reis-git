#!/usr/bin/env python3
"""
WhatsApp Disparo — API Oficial (Cloud API)
Reis IA — Envio de template utility para base de contatos.

Usage:
    python whatsapp-disparo-oficial.py test                    # Envia 1 msg para Moroni
    python whatsapp-disparo-oficial.py dry-run                 # Preview sem enviar
    python whatsapp-disparo-oficial.py dry-run --limit 10      # Preview primeiros 10
    python whatsapp-disparo-oficial.py live                    # Envia para toda a lista
    python whatsapp-disparo-oficial.py live --limit 50         # Envia para primeiros 50
    python whatsapp-disparo-oficial.py live --delay 3          # Delay custom entre msgs (seg)
    python whatsapp-disparo-oficial.py status                  # Status do último disparo

Setup:
    1. Configure as variáveis no bloco CONFIGURAÇÃO abaixo
    2. Crie o template no Meta Business Manager (tipo: utility)
    3. Aguarde aprovação do template
    4. Prepare o arquivo JSON com a lista de contatos

Template utility sugerido (submeter no Meta Business):
    Nome: pesquisa_proximos_passos
    Categoria: UTILITY
    Idioma: pt_BR
    Body:
        Olá {{1}}, aqui é o Moroni da Reis IA.

        Estamos aprimorando nossos programas de IA e sua opinião é essencial.
        Preparei uma pesquisa rápida (3 min) pra entender onde posso te ajudar mais.

        {{2}}

        Obrigado por fazer parte.
    Variáveis:
        {{1}} = nome do contato
        {{2}} = link da pesquisa
"""

import json
import os
import sys
import time
import random
import argparse
from datetime import datetime

# ============================================================
# CONFIGURAÇÃO — Preencha antes de usar
# ============================================================

# Meta Cloud API credentials
# Obter em: https://developers.facebook.com > WhatsApp > API Setup
PHONE_NUMBER_ID = os.environ.get("WA_PHONE_NUMBER_ID", "SEU_PHONE_NUMBER_ID")
ACCESS_TOKEN = os.environ.get("WA_ACCESS_TOKEN", "SEU_ACCESS_TOKEN")

# Template aprovado no Meta Business Manager
TEMPLATE_NAME = "pesquisa_proximos_passos"
TEMPLATE_LANGUAGE = "pt_BR"

# Link da pesquisa
SURVEY_URL = "https://pesquisa-journey.vercel.app"

# Número do Moroni (para teste)
MORONI_PHONE = "5511970578082"

# Lista de contatos (JSON)
# Formato: [{"nome": "João Silva", "whatsapp": "5511999999999"}, ...]
CONTACTS_FILE = "disparo-journey-lista.json"

# Log de envios
LOG_FILE = "disparo-journey-log.json"

# Delay entre mensagens (segundos) — recomendado: 2-5s
DEFAULT_DELAY = 3

# ============================================================
# API OFICIAL — FUNÇÕES
# ============================================================

API_URL = f"https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages"
HEADERS = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json",
}


def send_template(to_number: str, name: str) -> dict:
    """Envia template utility via API Oficial do WhatsApp."""
    import requests

    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "template",
        "template": {
            "name": TEMPLATE_NAME,
            "language": {"code": TEMPLATE_LANGUAGE},
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {"type": "text", "text": name},
                        {"type": "text", "text": SURVEY_URL},
                    ],
                }
            ],
        },
    }

    response = requests.post(API_URL, json=payload, headers=HEADERS, timeout=30)
    return {
        "status": response.status_code,
        "body": response.json(),
        "success": response.status_code == 200,
    }


def normalize_phone(phone: str) -> str:
    """Normaliza número para formato internacional sem +."""
    phone = phone.strip().replace("+", "").replace("-", "").replace(" ", "").replace("(", "").replace(")", "")
    if phone.startswith("0"):
        phone = "55" + phone[1:]
    if not phone.startswith("55"):
        phone = "55" + phone
    return phone


def get_first_name(full_name: str) -> str:
    """Extrai primeiro nome."""
    return full_name.strip().split()[0] if full_name.strip() else "Aluno"


def load_contacts() -> list:
    """Carrega lista de contatos do JSON."""
    if not os.path.exists(CONTACTS_FILE):
        print(f"  Arquivo não encontrado: {CONTACTS_FILE}")
        print(f"  Crie o arquivo com formato: [{{'nome': 'João', 'whatsapp': '5511999999999'}}]")
        sys.exit(1)

    with open(CONTACTS_FILE, "r", encoding="utf-8") as f:
        contacts = json.load(f)

    print(f"  {len(contacts)} contatos carregados de {CONTACTS_FILE}")
    return contacts


def load_log() -> dict:
    """Carrega log de envios anteriores."""
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"sent": [], "failed": [], "last_run": None}


def save_log(log: dict):
    """Salva log de envios."""
    log["last_run"] = datetime.now().isoformat()
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)


def get_already_sent(log: dict) -> set:
    """Retorna set de números já enviados."""
    return {entry["whatsapp"] for entry in log.get("sent", [])}


# ============================================================
# COMANDOS
# ============================================================

def cmd_test():
    """Envia 1 mensagem de teste para o Moroni."""
    print("\n=== TESTE — Enviando para Moroni ===\n")

    if PHONE_NUMBER_ID == "SEU_PHONE_NUMBER_ID":
        print("  ERRO: Configure PHONE_NUMBER_ID e ACCESS_TOKEN antes de usar.")
        print("  Veja instruções no topo do arquivo ou use variáveis de ambiente:")
        print("    export WA_PHONE_NUMBER_ID=123456789")
        print("    export WA_ACCESS_TOKEN=EAABx...")
        sys.exit(1)

    result = send_template(MORONI_PHONE, "Moroni")

    if result["success"]:
        print(f"  Enviado com sucesso!")
        print(f"  Message ID: {result['body'].get('messages', [{}])[0].get('id', '?')}")
    else:
        print(f"  ERRO: Status {result['status']}")
        print(f"  Resposta: {json.dumps(result['body'], indent=2)}")

        # Diagnóstico de erros comuns
        error = result["body"].get("error", {})
        code = error.get("code")
        if code == 190:
            print("\n  → Token expirado ou inválido. Gere um novo no Meta Business.")
        elif code == 131026:
            print("\n  → Número não registrado no WhatsApp ou formato inválido.")
        elif code == 132000:
            print(f"\n  → Template '{TEMPLATE_NAME}' não encontrado ou não aprovado.")
            print("    Verifique no Meta Business Manager > WhatsApp > Message Templates.")
        elif code == 132015:
            print("\n  → Template pausado ou desativado por baixa qualidade.")


def cmd_dry_run(limit: int):
    """Preview das mensagens sem enviar."""
    print("\n=== DRY RUN — Preview (nada será enviado) ===\n")

    contacts = load_contacts()
    log = load_log()
    already_sent = get_already_sent(log)

    pending = [c for c in contacts if normalize_phone(c["whatsapp"]) not in already_sent]
    if limit:
        pending = pending[:limit]

    print(f"  Total contatos: {len(contacts)}")
    print(f"  Já enviados: {len(already_sent)}")
    print(f"  Pendentes (este lote): {len(pending)}\n")

    for i, contact in enumerate(pending, 1):
        name = get_first_name(contact["nome"])
        phone = normalize_phone(contact["whatsapp"])
        print(f"  [{i:3d}] {name:<20s} → {phone}")

    print(f"\n  Para enviar: python {sys.argv[0]} live --limit {len(pending)}")


def cmd_live(limit: int, delay: float):
    """Envia mensagens para a lista de contatos."""
    print("\n=== DISPARO LIVE — API Oficial WhatsApp ===\n")

    if PHONE_NUMBER_ID == "SEU_PHONE_NUMBER_ID":
        print("  ERRO: Configure PHONE_NUMBER_ID e ACCESS_TOKEN primeiro.")
        sys.exit(1)

    contacts = load_contacts()
    log = load_log()
    already_sent = get_already_sent(log)

    pending = [c for c in contacts if normalize_phone(c["whatsapp"]) not in already_sent]
    if limit:
        pending = pending[:limit]

    if not pending:
        print("  Nenhum contato pendente. Todos já foram enviados.")
        return

    print(f"  Contatos neste lote: {len(pending)}")
    print(f"  Template: {TEMPLATE_NAME}")
    print(f"  Link: {SURVEY_URL}")
    print(f"  Delay: {delay}s entre mensagens")
    print(f"  Custo estimado: ~R${len(pending) * 0.045:.2f} (utility)\n")

    confirm = input("  Confirma envio? (sim/nao): ").strip().lower()
    if confirm not in ("sim", "s", "yes", "y"):
        print("  Cancelado.")
        return

    print()
    success_count = 0
    fail_count = 0

    for i, contact in enumerate(pending, 1):
        name = get_first_name(contact["nome"])
        phone = normalize_phone(contact["whatsapp"])

        result = send_template(phone, name)

        if result["success"]:
            msg_id = result["body"].get("messages", [{}])[0].get("id", "?")
            print(f"  [{i:3d}/{len(pending)}] {name:<20s} → {phone} ✓ ({msg_id[:12]}...)")
            log["sent"].append({
                "nome": contact["nome"],
                "whatsapp": phone,
                "message_id": msg_id,
                "sent_at": datetime.now().isoformat(),
            })
            success_count += 1
        else:
            error_msg = result["body"].get("error", {}).get("message", "Unknown error")
            print(f"  [{i:3d}/{len(pending)}] {name:<20s} → {phone} FALHOU: {error_msg}")
            log["failed"].append({
                "nome": contact["nome"],
                "whatsapp": phone,
                "error": error_msg,
                "failed_at": datetime.now().isoformat(),
            })
            fail_count += 1

        save_log(log)

        # Delay com variação para parecer natural
        if i < len(pending):
            jitter = delay + random.uniform(-0.5, 1.0)
            time.sleep(max(1, jitter))

    print(f"\n  === Resultado ===")
    print(f"  Enviados: {success_count}")
    print(f"  Falharam: {fail_count}")
    print(f"  Custo real: ~R${success_count * 0.045:.2f}")
    print(f"  Log salvo em: {LOG_FILE}")


def cmd_status():
    """Mostra status do último disparo."""
    print("\n=== STATUS DO DISPARO ===\n")

    log = load_log()

    sent = len(log.get("sent", []))
    failed = len(log.get("failed", []))
    last_run = log.get("last_run", "Nunca")

    print(f"  Último disparo: {last_run}")
    print(f"  Total enviados: {sent}")
    print(f"  Total falharam: {failed}")
    print(f"  Custo acumulado: ~R${sent * 0.045:.2f}")

    if os.path.exists(CONTACTS_FILE):
        with open(CONTACTS_FILE, "r", encoding="utf-8") as f:
            total = len(json.load(f))
        print(f"  Total na lista: {total}")
        print(f"  Pendentes: {total - sent}")


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="WhatsApp Disparo — API Oficial")
    parser.add_argument("command", choices=["test", "dry-run", "live", "status"],
                        help="Comando: test, dry-run, live, status")
    parser.add_argument("--limit", type=int, default=0,
                        help="Limitar quantidade de envios")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY,
                        help=f"Delay entre mensagens em segundos (default: {DEFAULT_DELAY})")

    args = parser.parse_args()

    if args.command == "test":
        cmd_test()
    elif args.command == "dry-run":
        cmd_dry_run(args.limit)
    elif args.command == "live":
        cmd_live(args.limit, args.delay)
    elif args.command == "status":
        cmd_status()


if __name__ == "__main__":
    main()
