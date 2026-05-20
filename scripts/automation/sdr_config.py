"""
SDR System — Shared Configuration
Reis IA WhatsApp SDR outreach system.
Supabase CRM + Evolution API integration.
"""

import os
import json
import requests
from datetime import datetime

# === Evolution API ===
EVOLUTION_API_BASE = "https://weirdpigeon-evolution.cloudfy.live"
EVOLUTION_API_KEY = "tqXOKoUIAH0llngaxg9k2dYnx5CpHrnp"
EVOLUTION_INSTANCE = "Reis"
EVOLUTION_SEND_URL = f"{EVOLUTION_API_BASE}/message/sendText/{EVOLUTION_INSTANCE}"
EVOLUTION_HEADERS = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}

# === Supabase ===
SUPABASE_URL = "https://weirdpigeon-supabase.cloudfy.live"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM3Njg1MTYsImV4cCI6MTgwNTMwNDUxNn0.Hziwx8ocWnFVLHvt5DhT8nTkL2XVMa58ofjL-0hCMxw"
SUPABASE_HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

# === SDR Config ===
MORONI_PHONE = "5511967615987"
OUR_NAMES = {"Você", "Moroni Reis IA", "Moroni"}
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONVERSATIONS_FILE = os.path.join(BASE_DIR, "sdr-conversations.json")

# === Conversation States ===
STATE_NOT_CONTACTED = "not_contacted"
STATE_FIRST_SENT = "first_message_sent"
STATE_REPLIED = "replied"
STATE_FOLLOW_UP_1 = "follow_up_1"
STATE_FOLLOW_UP_2 = "follow_up_2"
STATE_FOLLOW_UP_3 = "follow_up_3"
STATE_QUALIFIED = "qualified"
STATE_MEETING_BOOKED = "meeting_booked"
STATE_DISQUALIFIED = "disqualified"


# =============================================
# Supabase Helpers
# =============================================

def supabase_get(table, params=None):
    """GET from Supabase REST API."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    resp = requests.get(url, headers=SUPABASE_HEADERS, params=params or {})
    resp.raise_for_status()
    return resp.json()


def supabase_post(table, data):
    """INSERT into Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    resp = requests.post(url, headers=SUPABASE_HEADERS, json=data)
    resp.raise_for_status()
    return resp.json()


def supabase_patch(table, match_params, data):
    """UPDATE in Supabase with query params for matching."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    resp = requests.patch(url, headers=SUPABASE_HEADERS, params=match_params, json=data)
    resp.raise_for_status()
    return resp.json()


def supabase_count(table, params=None):
    """Count rows in table."""
    headers = {**SUPABASE_HEADERS, "Prefer": "count=exact"}
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    resp = requests.get(url, headers=headers, params={**(params or {}), "select": "id"})
    resp.raise_for_status()
    count = resp.headers.get("content-range", "").split("/")[-1]
    return int(count) if count and count != "*" else len(resp.json())


# =============================================
# Evolution API Helpers
# =============================================

def send_whatsapp(phone, text):
    """Send a WhatsApp message via Evolution API. Returns (status_code, response_json)."""
    payload = {"number": phone, "text": text}
    resp = requests.post(EVOLUTION_SEND_URL, headers=EVOLUTION_HEADERS, json=payload)
    return resp.status_code, resp.json()


def send_whatsapp_to_jid(jid, text):
    """Send message using jid (for @lid addresses)."""
    number = jid.replace("@s.whatsapp.net", "").replace("@lid", "")
    if "@lid" in jid:
        payload = {"number": jid, "text": text}
    else:
        payload = {"number": number, "text": text}
    resp = requests.post(EVOLUTION_SEND_URL, headers=EVOLUTION_HEADERS, json=payload)
    return resp.status_code, resp.json()


def fetch_recent_messages(limit=50):
    """Fetch recent messages from Evolution API."""
    url = f"{EVOLUTION_API_BASE}/chat/findMessages/{EVOLUTION_INSTANCE}"
    resp = requests.post(url, headers=EVOLUTION_HEADERS, json={"where": {}, "limit": limit})
    data = resp.json()
    return data.get("messages", {}).get("records", [])


# =============================================
# Conversation State (JSON file backup)
# =============================================

def load_conversations():
    """Load conversation state from JSON file."""
    try:
        with open(CONVERSATIONS_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_conversations(convos):
    """Save conversation state to JSON file."""
    with open(CONVERSATIONS_FILE, "w") as f:
        json.dump(convos, f, indent=2, ensure_ascii=False)


# =============================================
# CRM Helpers
# =============================================

def fetch_contacts_by_product(product, min_score=0, has_phone=True, limit=500):
    """Fetch contacts from CRM filtered by best_fit_product."""
    params = {
        "best_fit_product": f"eq.{product}",
        "order": "opportunity_score.desc.nullslast",
        "limit": str(limit),
    }
    if min_score > 0:
        params["opportunity_score"] = f"gte.{min_score}"
    if has_phone:
        params["phone"] = "neq."

    return supabase_get("contacts", params)


def fetch_contact_by_phone(phone):
    """Find a contact by phone number."""
    clean = phone.replace("+", "").replace(" ", "").replace("-", "")
    contacts = supabase_get("contacts", {"phone": f"ilike.%{clean[-10:]}%", "limit": "1"})
    return contacts[0] if contacts else None


def update_contact(contact_id, updates):
    """Update a contact in the CRM."""
    return supabase_patch("contacts", {"id": f"eq.{contact_id}"}, {
        **updates,
        "updated_at": datetime.utcnow().isoformat()
    })


def log_sdr_conversation(contact_id, contact_phone, direction, message_text, category, state, extra=None):
    """Log a conversation entry to sdr_conversations table in Supabase."""
    record = {
        "contact_id": contact_id,
        "contact_phone": contact_phone,
        "direction": direction,  # 'outbound' or 'inbound'
        "message_text": message_text,
        "category": category,  # 'marketing', 'systems', 'mentoria'
        "conversation_state": state,
        "created_at": datetime.utcnow().isoformat(),
    }
    if extra:
        record["metadata"] = json.dumps(extra) if isinstance(extra, dict) else extra
    try:
        return supabase_post("sdr_conversations", record)
    except Exception as e:
        print(f"  [WARN] Failed to log to sdr_conversations: {e}")
        return None


def create_or_update_deal(contact, category):
    """Create a deal for the contact if one doesn't exist."""
    type_map = {
        "marketing": "marketing",
        "systems": "systems",
        "mentoria": "builders",
        "builders-mentoria": "builders",
    }
    deal_type = type_map.get(category, "marketing")

    # Check if deal already exists for this contact
    existing = supabase_get("deals", {
        "contact_name": f"eq.{contact.get('name', '')}",
        "type": f"eq.{deal_type}",
        "limit": "1",
    })

    if existing:
        # Update last_activity
        supabase_patch("deals", {"id": f"eq.{existing[0]['id']}"}, {
            "last_activity": datetime.utcnow().strftime("%Y-%m-%d"),
            "stage": "qualified" if existing[0].get("stage") == "lead" else existing[0].get("stage"),
        })
        return existing[0]

    # Create new deal
    value_map = {"marketing": 2000, "systems": 5000, "builders": 3000}
    deal = {
        "title": f"SDR Outreach — {contact.get('name', 'Lead')}",
        "contact_name": contact.get("name", ""),
        "company": contact.get("company", ""),
        "value": value_map.get(deal_type, 2000),
        "stage": "lead",
        "type": deal_type,
        "notes": f"SDR outreach iniciado em {datetime.utcnow().strftime('%d/%m/%Y')}",
        "last_activity": datetime.utcnow().strftime("%Y-%m-%d"),
    }
    if contact.get("id"):
        deal["contact_id"] = contact["id"]

    try:
        return supabase_post("deals", deal)[0]
    except Exception as e:
        print(f"  [WARN] Failed to create deal: {e}")
        return None


# =============================================
# Message Templates
# =============================================

def get_first_name(full_name):
    """Extract first name from full name."""
    if not full_name:
        return "amigo"
    return full_name.strip().split()[0]


def generate_marketing_message(contact):
    """Generate personalized SDR message for marketing leads."""
    name = get_first_name(contact.get("name"))
    objetivo = contact.get("objetivo", "")
    form_type = contact.get("form_type", "")
    tags = contact.get("tags", []) or []
    faturamento = contact.get("faturamento", "")
    cargo = contact.get("cargo", "")

    # Build context reference
    context_ref = ""
    if "Diagnóstico" in tags:
        context_ref = "Vi que voce fez o diagnostico de IA no nosso site"
    elif "Imersão" in tags:
        context_ref = "Vi que voce participou da nossa imersao"
    elif "MDV" in tags or "AI Hunters" in tags:
        context_ref = "Vi que voce acompanha nosso conteudo"
    elif form_type:
        context_ref = f"Vi que voce se inscreveu no {form_type}"
    else:
        context_ref = "Vi que voce demonstrou interesse em IA aplicada a negocios"

    # Build objetivo reference
    obj_ref = ""
    if objetivo:
        obj_ref = f" e mencionou que quer {objetivo.lower().rstrip('.')}"

    # Build revenue context for approach angle
    high_ticket = faturamento and any(x in faturamento for x in ["R$20", "R$30", "Mais de"])

    if high_ticket:
        msg = f"""{name}, aqui é o Moroni da Reis IA.

{context_ref}{obj_ref}.

Queria trocar uma ideia rapida com voce. A gente tem ajudado empresarios no seu perfil a usar IA como estrategia de receita — nao como ferramenta de TI, mas como motor de crescimento real.

Na pratica: identificar onde IA gera dinheiro novo, cortar custos que ninguem ta vendo, e montar um plano que se paga em 90 dias.

Faz sentido a gente conversar 15 minutos sobre isso? Sem compromisso, é uma conversa estrategica."""
    else:
        msg = f"""{name}, aqui é o Moroni da Reis IA.

{context_ref}{obj_ref}.

Tenho algo que pode te interessar. A gente trabalha com empresarios que querem usar IA pra gerar resultado financeiro — nao teoria, nao curso, resultado.

O primeiro passo é uma conversa de 15 minutos onde eu entendo seu cenario e te mostro onde IA pode gerar receita ou cortar custo no seu negocio.

Quer marcar?"""

    return msg


def generate_systems_message(contact):
    """Generate personalized SDR message for systems/implementation leads."""
    name = get_first_name(contact.get("name"))
    company = contact.get("company", "")
    objetivo = contact.get("objetivo", "")
    faturamento = contact.get("faturamento", "")
    cargo = contact.get("cargo", "")

    company_ref = f" na {company}" if company else ""
    obj_ref = ""
    if objetivo:
        obj_ref = f"\n\nVi que voce tem interesse em {objetivo.lower().rstrip('.')}. "
    else:
        obj_ref = "\n\n"

    msg = f"""{name}, aqui é o Moroni da Reis IA.
{obj_ref}A gente implementa IA direto na operacao de empresas — nao vendemos curso nem ferramenta. Montamos o sistema, treinamos a equipe e entregamos funcionando.

Ja fizemos isso pra empresas que estavam gastando com IA sem ver retorno. Em 90 dias, o investimento se pagou.

Queria entender melhor o cenario{company_ref} pra ver se faz sentido a gente conversar. Seria uma call rapida de 15-20 minutos.

Posso te mandar o link pra agendar?"""

    return msg


def generate_mentoria_message(contact):
    """Generate personalized SDR message for mentorship leads."""
    name = get_first_name(contact.get("name"))
    objetivo = contact.get("objetivo", "")
    cargo = contact.get("cargo", "")
    tags = contact.get("tags", []) or []

    context_ref = ""
    if "Formação" in tags:
        context_ref = "Voce que ja é da formacao sabe que IA muda o jogo. "
    elif "AI Hunters" in tags:
        context_ref = "Voce que ja ta no AI Hunters sabe que IA muda o jogo. "

    obj_ref = ""
    if objetivo:
        obj_ref = f"Vi que voce quer {objetivo.lower().rstrip('.')}. "

    msg = f"""{name}, aqui é o Moroni.

{context_ref}{obj_ref}Queria te falar de algo que estou abrindo pra poucas pessoas.

Tenho um programa de mentoria 1:1 onde eu trabalho direto com voce pra montar sua operacao com IA — seja pra oferecer como servico, criar produtos, ou escalar seu negocio atual.

Nao é curso. É eu, voce, e um plano concreto. A gente define o caminho, executa junto e ajusta toda semana.

Quero entender seu momento pra ver se faz sentido. Bora trocar uma ideia?"""

    return msg


# Category mapping
CATEGORY_MAP = {
    "marketing": {
        "product_filter": "marketing",
        "generate_fn": generate_marketing_message,
        "label": "Marketing",
    },
    "systems": {
        "product_filter": "systems",
        "generate_fn": generate_systems_message,
        "label": "Systems",
    },
    "mentoria": {
        "product_filter": "builders-mentoria",
        "generate_fn": generate_mentoria_message,
        "label": "Mentoria",
    },
}
