#!/usr/bin/env python3
"""
SDR Chat — Reis IA
Interactive WhatsApp conversation handler for SDR qualification.
Monitors replies and responds following the R.E.I.S. framework.

Usage:
    python sdr-chat.py test                    # Start test conversation with Moroni
    python sdr-chat.py lead <contact_id>       # Start conversation with specific lead
"""

import sys
import time
import json
import random
from datetime import datetime

from sdr_config import (
    MORONI_PHONE,
    EVOLUTION_API_BASE,
    EVOLUTION_HEADERS,
    EVOLUTION_INSTANCE,
    OUR_NAMES,
    send_whatsapp,
    fetch_recent_messages,
    log_sdr_conversation,
    update_contact,
    load_conversations,
    save_conversations,
    supabase_get,
    supabase_patch,
    get_first_name,
    create_or_update_deal,
)

# =============================================
# Conversation Stage Handlers
# =============================================

# Stage 1: Opening (already sent by sdr-outreach.py or sent here)
# Stage 2: Consultive Diagnosis — ask about their situation
# Stage 3: Mirroring & Validation — reflect what they said, map to R.E.I.S.
# Stage 4: Bridge to Meeting — create curiosity, propose call
# Stage 5: Objection Handling — budget, timing, "let me think"

STAGE_OPENING = "opening"
STAGE_DIAGNOSIS = "diagnosis"
STAGE_MIRRORING = "mirroring"
STAGE_BRIDGE = "bridge"
STAGE_OBJECTION = "objection"
STAGE_BOOKED = "booked"
STAGE_CLOSED = "closed"


def classify_reply(text):
    """Classify the type of reply to determine next action."""
    text_lower = text.lower().strip()

    # Negative / No interest
    negative_signals = [
        "não", "nao", "sem interesse", "não quero", "nao quero",
        "não preciso", "nao preciso", "para", "pare", "stop",
        "remove", "sair", "cancelar", "não obrigado", "nao obrigado",
    ]
    for signal in negative_signals:
        if signal in text_lower:
            return "negative"

    # Price question
    price_signals = ["quanto", "preço", "preco", "valor", "custa", "investimento", "tabela"]
    for signal in price_signals:
        if signal in text_lower:
            return "price_question"

    # Time objection
    time_signals = [
        "agora não", "agora nao", "sem tempo", "corrido",
        "depois", "outro momento", "semana que vem", "mes que vem",
        "ocupado", "não posso", "nao posso",
    ]
    for signal in time_signals:
        if signal in text_lower:
            return "time_objection"

    # "Let me think" objection
    think_signals = [
        "vou pensar", "deixa eu pensar", "preciso pensar",
        "vou ver", "vou analisar", "deixa eu ver", "talvez",
    ]
    for signal in think_signals:
        if signal in text_lower:
            return "think_objection"

    # Already tried AI
    tried_signals = [
        "já tentei", "ja tentei", "já usei", "ja usei",
        "não funcionou", "nao funcionou", "gastei", "perdi dinheiro",
        "não deu certo", "nao deu certo",
    ]
    for signal in tried_signals:
        if signal in text_lower:
            return "tried_before"

    # Positive / Interest
    positive_signals = [
        "sim", "quero", "faz sentido", "bora", "vamos",
        "pode ser", "manda", "mande", "claro", "com certeza",
        "show", "top", "massa", "legal", "interessante",
        "me conta", "conta mais", "como funciona", "explica",
        "agendar", "agenda", "marcar", "marca", "link",
        "ok", "tá", "ta", "beleza", "fechado",
    ]
    for signal in positive_signals:
        if signal in text_lower:
            return "positive"

    # Question about what we do
    question_signals = [
        "o que", "como voces", "como vocês", "qual", "quais",
        "me explica", "entender melhor", "mais detalhes", "como é",
    ]
    for signal in question_signals:
        if signal in text_lower:
            return "question"

    # Generic short reply (oi, fala, etc.)
    if len(text_lower) <= 15:
        return "generic_short"

    # Default: treat as engagement
    return "engagement"


def generate_diagnosis_response(contact, reply_text, reply_type, category):
    """Stage 2: Ask diagnostic questions based on their reply."""
    name = get_first_name(contact.get("name"))

    if reply_type == "positive":
        responses = [
            f"""Boa, {name}.

Pra eu entender melhor seu cenario e te dar algo concreto na nossa conversa:

Qual é o principal desafio que voce ta enfrentando hoje no negocio? E voce ja tentou usar IA pra resolver alguma coisa?""",

            f"""Show, {name}.

Antes de a gente marcar, me ajuda com duas coisas rapidas pra eu ja preparar algo especifico pra voce:

1. Qual o maior gargalo do seu negocio hoje?
2. Ja investiu em algo de IA antes?""",
        ]

    elif reply_type == "question":
        if category == "systems":
            responses = [
                f"""{name}, resumindo: a gente entra na operacao da empresa e implementa IA onde faz sentido financeiro. Nao vendemos software, a gente monta o sistema pra voce.

Mas pra te dar um exemplo concreto do que fariamos no seu caso — me conta: qual o principal processo do seu negocio que ta consumindo mais tempo ou dinheiro hoje?""",
            ]
        elif category == "mentoria":
            responses = [
                f"""{name}, funciona assim: é um acompanhamento 1:1 comigo, semanal, onde a gente define a sua estrategia com IA e executa junto.

Pode ser pra montar um negocio de AI, criar produtos, ou escalar o que voce ja tem. Depende do seu momento.

Me conta: o que voce ta buscando construir? E ta em que fase hoje?""",
            ]
        else:
            responses = [
                f"""{name}, a Reis IA ajuda empresarios a usar IA como estrategia de receita. Na pratica, a gente identifica onde IA gera dinheiro novo ou corta custo no seu negocio.

Nao é curso, nao é ferramenta. É estrategia aplicada.

Pra eu te dar algo concreto: qual o seu negocio e qual o maior desafio hoje?""",
            ]

    elif reply_type == "generic_short" or reply_type == "engagement":
        responses = [
            f"""{name}, deixa eu ser mais direto.

A gente ajuda empresarios a transformar IA em resultado financeiro. Nao teoria — resultado.

Pra eu entender se faz sentido pra voce: qual o seu negocio e qual a maior dor de cabeca hoje?""",
        ]

    elif reply_type == "tried_before":
        responses = [
            f"""Entendo, {name}. E olha, voce nao ta sozinho — a maioria dos empresarios que nos procura ja tentou antes e nao deu certo.

O problema quase nunca é a tecnologia. É a falta de estrategia de receita por tras.

Me conta: o que voce tentou e por que nao funcionou? Quero entender pra te mostrar o que fariamos diferente.""",
        ]

    else:
        responses = [
            f"""{name}, pra eu entender seu cenario:

Qual é o principal desafio do seu negocio hoje? E voce ja tentou algo com IA?""",
        ]

    return random.choice(responses)


def generate_mirroring_response(contact, reply_text, category):
    """Stage 3: Mirror what they said and validate, map to R.E.I.S. pillar."""
    name = get_first_name(contact.get("name"))
    text_lower = reply_text.lower()

    # Detect R.E.I.S. pillar from their pain
    pillar = "Revenue"
    if any(w in text_lower for w in ["custo", "tempo", "processo", "equipe", "operacao", "operação", "gargalo", "manual"]):
        pillar = "Efficiency"
    elif any(w in text_lower for w in ["lead", "cliente", "venda", "marketing", "captacao", "captação", "trafego", "tráfego"]):
        pillar = "Inbound"
    elif any(w in text_lower for w in ["sistema", "automacao", "automação", "implementar", "integrar", "ferramenta"]):
        pillar = "Systems"

    pillar_descriptions = {
        "Revenue": "gerar novas fontes de receita usando IA",
        "Efficiency": "cortar custos e otimizar operacao com IA",
        "Inbound": "atrair e converter mais clientes com IA",
        "Systems": "implementar sistemas de IA que funcionam na pratica",
    }

    responses = [
        f"""Entendi, {name}. Pelo que voce ta me dizendo, o ponto principal é {pillar_descriptions[pillar]}.

Isso é exatamente o que a gente faz. E posso te adiantar: empresarios no seu perfil geralmente encontram resultados nos primeiros 90 dias quando a estrategia ta certa.

Faz sentido marcar uma conversa de 15 minutos pra eu te mostrar como isso funcionaria no seu caso especifico? Sem compromisso — é uma conversa estrategica.""",

        f"""{name}, faz total sentido o que voce ta passando.

A boa noticia: ja ajudamos empresarios com desafios parecidos e o retorno veio rapido quando a estrategia de IA foi montada certa.

Olha, a melhor coisa que posso fazer por voce agora é uma conversa rapida de 15 minutos onde eu analiso seu cenario e te mostro um caminho concreto.

Quer marcar? Te mando o link.""",
    ]

    return random.choice(responses)


def generate_bridge_response(contact, reply_text, reply_type, category):
    """Stage 4: Bridge to meeting booking."""
    name = get_first_name(contact.get("name"))

    if reply_type == "positive":
        responses = [
            f"""Perfeito, {name}.

Agenda aqui o melhor horario pra voce:
https://cal.com/moronireis/estrategia-ia

Sao 15-20 minutos. Eu vou preparar algo especifico pro seu cenario antes da call.

Te vejo la.""",

            f"""Show, {name}.

Clica aqui e escolhe o melhor horario:
https://cal.com/moronireis/estrategia-ia

Vou preparar uma analise inicial do seu caso antes da nossa conversa.

Qualquer duvida me chama aqui.""",
        ]

    elif reply_type == "price_question":
        responses = [
            f"""{name}, depende muito do cenario de cada empresa. Nao tem tabela fixa porque cada projeto é diferente.

O que posso te dizer: o investimento se paga nos primeiros meses quando a estrategia ta certa. Ja tivemos clientes que recuperaram o investimento no primeiro mes.

A melhor forma de te dar um numero real é na conversa de 15 minutos, onde eu entendo seu caso:
https://cal.com/moronireis/estrategia-ia

Agenda la e a gente alinha tudo.""",
        ]

    elif reply_type == "time_objection":
        responses = [
            f"""Sem problema, {name}. Sao literalmente 15 minutos.

Escolhe o melhor dia e horario aqui — tem opcoes flexiveis:
https://cal.com/moronireis/estrategia-ia

Pode ser na semana que vem, no horario que ficar melhor pra voce.""",
        ]

    elif reply_type == "think_objection":
        responses = [
            f"""Claro, {name}. So uma coisa: nao precisa decidir nada agora. A conversa de 15 minutos é justamente pra voce ter mais informacao antes de pensar.

Se fizer sentido, otimo. Se nao, sem problema nenhum.

Agenda aqui quando for melhor:
https://cal.com/moronireis/estrategia-ia""",
        ]

    else:
        responses = [
            f"""{name}, o proximo passo é uma conversa rapida de 15 minutos onde eu analiso seu cenario.

Agenda aqui:
https://cal.com/moronireis/estrategia-ia

Sem compromisso. Se fizer sentido, a gente segue. Se nao, voce sai com uma analise gratuita do seu negocio.""",
        ]

    return random.choice(responses)


def generate_objection_response(contact, reply_type):
    """Handle objections."""
    name = get_first_name(contact.get("name"))

    if reply_type == "negative":
        return f"""Sem problema, {name}. Respeito sua decisao.

Se mudar de ideia no futuro, é so me chamar aqui. Sucesso no seu negocio."""

    elif reply_type == "price_question":
        return generate_bridge_response(contact, "", "price_question", "marketing")

    elif reply_type == "time_objection":
        return generate_bridge_response(contact, "", "time_objection", "marketing")

    elif reply_type == "think_objection":
        return generate_bridge_response(contact, "", "think_objection", "marketing")

    else:
        return f"""{name}, entendo. Se tiver qualquer duvida, pode me chamar aqui.

Quando quiser agendar:
https://cal.com/moronireis/estrategia-ia"""


def get_next_stage(current_stage, reply_type):
    """Determine next conversation stage based on current stage and reply type."""
    if reply_type == "negative":
        return STAGE_CLOSED

    if current_stage == STAGE_OPENING:
        return STAGE_DIAGNOSIS

    if current_stage == STAGE_DIAGNOSIS:
        if reply_type in ("positive", "engagement", "generic_short", "question", "tried_before"):
            return STAGE_MIRRORING
        return STAGE_DIAGNOSIS  # Ask again

    if current_stage == STAGE_MIRRORING:
        return STAGE_BRIDGE

    if current_stage == STAGE_BRIDGE:
        if reply_type == "positive":
            return STAGE_BOOKED
        return STAGE_OBJECTION

    if current_stage == STAGE_OBJECTION:
        if reply_type == "positive":
            return STAGE_BRIDGE
        return STAGE_CLOSED

    return STAGE_BRIDGE


def generate_response(contact, reply_text, stage, category):
    """Generate the appropriate response based on conversation stage."""
    reply_type = classify_reply(reply_text)
    next_stage = get_next_stage(stage, reply_type)

    print(f"  Reply type: {reply_type}")
    print(f"  Current stage: {stage} -> Next: {next_stage}")

    if next_stage == STAGE_CLOSED:
        response = generate_objection_response(contact, reply_type)
    elif next_stage == STAGE_DIAGNOSIS:
        response = generate_diagnosis_response(contact, reply_text, reply_type, category)
    elif next_stage == STAGE_MIRRORING:
        response = generate_mirroring_response(contact, reply_text, category)
    elif next_stage == STAGE_BRIDGE or next_stage == STAGE_BOOKED:
        response = generate_bridge_response(contact, reply_text, reply_type, category)
    elif next_stage == STAGE_OBJECTION:
        response = generate_objection_response(contact, reply_type)
    else:
        response = generate_bridge_response(contact, reply_text, reply_type, category)

    return response, next_stage


# =============================================
# Conversation Loop
# =============================================

def run_conversation(phone, contact, category, initial_message=None):
    """Run an interactive SDR conversation with a single contact."""
    name = get_first_name(contact.get("name"))
    processed_ids = set()
    stage = STAGE_OPENING

    print(f"\n{'='*60}")
    print(f"  SDR CHAT ATIVO")
    print(f"  Lead: {name} ({phone})")
    print(f"  Categoria: {category}")
    print(f"  Ctrl+C para parar")
    print(f"{'='*60}\n")

    # Send opening message if provided
    if initial_message:
        print(f"[ENVIANDO] Mensagem de abertura...")
        status, resp = send_whatsapp(phone, initial_message)
        msg_id = resp.get("key", {}).get("id", "N/A")
        print(f"[OK] ID: {msg_id}\n")

        log_sdr_conversation(
            contact_id=contact.get("id"),
            contact_phone=phone,
            direction="outbound",
            message_text=initial_message,
            category=category,
            state="first_message_sent",
            extra={"msg_id": msg_id, "stage": STAGE_OPENING},
        )

    # First run: mark existing messages as processed
    print("[INIT] Carregando mensagens existentes...")
    messages = fetch_recent_messages(limit=100)
    for msg in messages:
        processed_ids.add(msg.get("key", {}).get("id", ""))
    print(f"[INIT] {len(processed_ids)} mensagens existentes ignoradas")
    print(f"[AGUARDANDO] Esperando resposta de {name}...\n")

    while True:
        try:
            messages = fetch_recent_messages(limit=50)
            now = datetime.now().strftime("%H:%M:%S")

            for msg in messages:
                msg_id = msg.get("key", {}).get("id", "")
                jid = msg.get("key", {}).get("remoteJid", "")
                from_me = msg.get("key", {}).get("fromMe", True)
                push_name = msg.get("pushName", "")

                if msg_id in processed_ids:
                    continue

                processed_ids.add(msg_id)

                # Skip our messages
                if from_me or push_name in OUR_NAMES:
                    continue

                # Skip groups
                if "@g.us" in jid:
                    continue

                # Check if this message is from our target
                msg_phone = jid.replace("@s.whatsapp.net", "").replace("@lid", "")
                # Match by last 10-11 digits
                if phone[-10:] not in msg_phone and msg_phone[-10:] not in phone:
                    continue

                # Extract message text
                reply_text = (
                    msg.get("message", {}).get("conversation", "") or
                    msg.get("message", {}).get("extendedTextMessage", {}).get("text", "") or
                    ""
                )

                if not reply_text:
                    print(f"[{now}] Recebido media/audio de {name} — ignorando")
                    continue

                print(f"\n[{now}] RESPOSTA de {name}: \"{reply_text}\"")

                # Log inbound
                log_sdr_conversation(
                    contact_id=contact.get("id"),
                    contact_phone=phone,
                    direction="inbound",
                    message_text=reply_text,
                    category=category,
                    state=stage,
                    extra={"push_name": push_name, "msg_id": msg_id},
                )

                # Generate response
                response, next_stage = generate_response(contact, reply_text, stage, category)
                stage = next_stage

                # Delay before responding (natural feel)
                delay = random.uniform(8, 15)
                print(f"[DELAY] Aguardando {delay:.0f}s antes de responder...")
                time.sleep(delay)

                # Send response
                print(f"[ENVIANDO] Stage: {stage}")
                print(f"---")
                print(response)
                print(f"---")

                status, resp = send_whatsapp(phone, response)
                resp_id = resp.get("key", {}).get("id", "N/A")
                print(f"[OK] ID: {resp_id}")

                # Log outbound
                log_sdr_conversation(
                    contact_id=contact.get("id"),
                    contact_phone=phone,
                    direction="outbound",
                    message_text=response,
                    category=category,
                    state=stage,
                    extra={"msg_id": resp_id, "stage": stage},
                )

                # Update contact notes
                if contact.get("id") and contact["id"] != "test-moroni":
                    try:
                        current = supabase_get("contacts", {"id": f"eq.{contact['id']}", "limit": "1"})
                        if current:
                            notes = current[0].get("notes", "") or ""
                            note = f"[SDR CHAT {datetime.now().strftime('%d/%m %H:%M')}] {stage}: Lead disse \"{reply_text[:80]}\""
                            update_contact(contact["id"], {"notes": f"{notes}\n{note}".strip()})
                    except Exception:
                        pass

                # Check if conversation ended
                if stage in (STAGE_BOOKED, STAGE_CLOSED):
                    final = "QUALIFICADO - Meeting link enviado" if stage == STAGE_BOOKED else "ENCERRADO"
                    print(f"\n{'='*60}")
                    print(f"  CONVERSA FINALIZADA: {final}")
                    print(f"{'='*60}\n")

                    # Update deal if booked
                    if stage == STAGE_BOOKED and contact.get("id") and contact["id"] != "test-moroni":
                        try:
                            deals = supabase_get("deals", {"contact_id": f"eq.{contact['id']}", "limit": "1"})
                            if deals:
                                supabase_patch("deals", {"id": f"eq.{deals[0]['id']}"}, {
                                    "stage": "qualified",
                                    "last_activity": datetime.utcnow().strftime("%Y-%m-%d"),
                                })
                        except Exception:
                            pass

                    return

                print(f"\n[AGUARDANDO] Esperando proxima resposta de {name}...\n")

            time.sleep(8)

        except KeyboardInterrupt:
            print(f"\n\nChat encerrado manualmente. Stage atual: {stage}")
            break
        except Exception as e:
            print(f"[ERRO] {e}")
            time.sleep(15)


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "test"
    category = sys.argv[2] if len(sys.argv) > 2 else "marketing"

    if mode == "test":
        # Test with Moroni
        contact = {
            "id": "test-moroni",
            "name": "Moroni",
            "phone": MORONI_PHONE,
            "company": "TechBrasil",
            "cargo": "CEO",
            "faturamento": "Mais de R$30 mil",
            "objetivo": "escalar operacao com IA",
            "tags": ["Diagnóstico"],
            "form_type": "diagnostico",
        }

        from sdr_config import CATEGORY_MAP
        generate_fn = CATEGORY_MAP[category]["generate_fn"]
        opening = generate_fn(contact)

        run_conversation(MORONI_PHONE, contact, category, initial_message=opening)

    elif mode == "lead":
        contact_id = sys.argv[2] if len(sys.argv) > 2 else None
        cat = sys.argv[3] if len(sys.argv) > 3 else "marketing"

        if not contact_id:
            print("Uso: python sdr-chat.py lead <contact_id> [category]")
            sys.exit(1)

        contacts = supabase_get("contacts", {"id": f"eq.{contact_id}", "limit": "1"})
        if not contacts:
            print(f"Contato {contact_id} nao encontrado")
            sys.exit(1)

        contact = contacts[0]
        phone = contact.get("phone", "").replace("+", "").replace(" ", "").replace("-", "")

        if not phone:
            print(f"Contato {contact.get('name')} nao tem telefone")
            sys.exit(1)

        from sdr_config import CATEGORY_MAP
        generate_fn = CATEGORY_MAP[cat]["generate_fn"]
        opening = generate_fn(contact)

        create_or_update_deal(contact, cat)
        run_conversation(phone, contact, cat, initial_message=opening)

    else:
        print("Uso:")
        print("  python sdr-chat.py test [category]          # Teste com Moroni")
        print("  python sdr-chat.py lead <contact_id> [cat]  # Lead real")
        print()
        print("Categorias: marketing, systems, mentoria")


if __name__ == "__main__":
    main()
