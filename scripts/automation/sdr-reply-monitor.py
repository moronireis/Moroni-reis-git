#!/usr/bin/env python3
"""
SDR Reply Monitor — Reis IA
Monitors incoming WhatsApp messages, matches to leads, updates CRM.

Usage:
    python sdr-reply-monitor.py              # Start monitoring
    python sdr-reply-monitor.py --interval 15  # Custom poll interval (seconds)
"""

import time
import argparse
from datetime import datetime

from sdr_config import (
    OUR_NAMES,
    MORONI_PHONE,
    STATE_REPLIED,
    fetch_recent_messages,
    fetch_contact_by_phone,
    send_whatsapp,
    log_sdr_conversation,
    update_contact,
    load_conversations,
    save_conversations,
    supabase_get,
    supabase_patch,
    get_first_name,
)


def get_contacted_phones():
    """Build a map of phone -> conversation data from sdr_conversations."""
    try:
        records = supabase_get("sdr_conversations", {
            "direction": "eq.outbound",
            "select": "contact_id,contact_phone,category,metadata",
            "limit": "5000",
        })
        phone_map = {}
        for r in records:
            phone = r.get("contact_phone", "")
            if phone:
                phone_map[phone] = {
                    "contact_id": r.get("contact_id"),
                    "category": r.get("category"),
                }
                # Also map last 10 digits for matching
                if len(phone) >= 10:
                    phone_map[phone[-10:]] = phone_map[phone]
        return phone_map
    except Exception as e:
        print(f"[WARN] Could not fetch from sdr_conversations: {e}")
        # Fallback to local JSON
        convos = load_conversations()
        phone_map = {}
        for cid, data in convos.items():
            phone = data.get("phone", "")
            if phone:
                phone_map[phone] = {"contact_id": cid, "category": data.get("category")}
                if len(phone) >= 10:
                    phone_map[phone[-10:]] = phone_map[phone]
        return phone_map


def get_replied_phones():
    """Get set of phones that already have inbound messages logged."""
    try:
        records = supabase_get("sdr_conversations", {
            "direction": "eq.inbound",
            "select": "contact_phone",
            "limit": "5000",
        })
        return {r["contact_phone"] for r in records if r.get("contact_phone")}
    except Exception:
        return set()


def extract_phone_from_jid(jid):
    """Extract phone number from WhatsApp jid."""
    return jid.replace("@s.whatsapp.net", "").replace("@lid", "")


def match_phone(jid, phone_map):
    """Try to match a jid to our contacted leads."""
    phone = extract_phone_from_jid(jid)

    # Direct match
    if phone in phone_map:
        return phone, phone_map[phone]

    # Last 10 digits match
    if len(phone) >= 10 and phone[-10:] in phone_map:
        return phone, phone_map[phone[-10:]]

    return phone, None


def notify_moroni(contact_name, phone, message_text, category):
    """Send notification to Moroni about a lead reply."""
    cat_label = {"marketing": "Marketing", "systems": "Systems", "mentoria": "Mentoria"}.get(category, category)

    notification = f"""*SDR ALERT — Resposta recebida*

Lead: {contact_name}
Telefone: {phone}
Categoria: {cat_label}
Mensagem: "{message_text[:200]}"

Responda diretamente no WhatsApp ou use o SDR agent."""

    try:
        send_whatsapp(MORONI_PHONE, notification)
        print(f"  Notificacao enviada para Moroni")
    except Exception as e:
        print(f"  [WARN] Falha ao notificar Moroni: {e}")


def process_reply(jid, push_name, message_text, conv_data, phone):
    """Process an incoming reply from a lead."""
    contact_id = conv_data.get("contact_id")
    category = conv_data.get("category", "marketing")
    now = datetime.now().strftime("%H:%M:%S")

    print(f"[{now}] RESPOSTA de {push_name} ({phone}): \"{message_text[:80]}\"")

    # 1. Log to sdr_conversations
    log_sdr_conversation(
        contact_id=contact_id,
        contact_phone=phone,
        direction="inbound",
        message_text=message_text,
        category=category,
        state=STATE_REPLIED,
        extra={"push_name": push_name, "jid": jid},
    )

    # 2. Update contact in CRM
    if contact_id and contact_id != "test-moroni":
        try:
            contact = supabase_get("contacts", {"id": f"eq.{contact_id}", "limit": "1"})
            if contact:
                current_notes = contact[0].get("notes", "") or ""
                reply_note = f"[SDR REPLY {datetime.now().strftime('%d/%m/%Y %H:%M')}] Lead respondeu: \"{message_text[:100]}\""
                update_contact(contact_id, {
                    "notes": f"{current_notes}\n{reply_note}".strip(),
                })
                print(f"  CRM atualizado — notes do contato atualizadas")
        except Exception as e:
            print(f"  [WARN] Falha ao atualizar contato: {e}")

        # 3. Update deal stage to 'qualified'
        try:
            deals = supabase_get("deals", {
                "contact_id": f"eq.{contact_id}",
                "limit": "1",
            })
            if deals and deals[0].get("stage") == "lead":
                supabase_patch("deals", {"id": f"eq.{deals[0]['id']}"}, {
                    "stage": "qualified",
                    "last_activity": datetime.utcnow().strftime("%Y-%m-%d"),
                    "notes": f"{deals[0].get('notes', '')}\nLead respondeu em {datetime.now().strftime('%d/%m/%Y')}".strip(),
                })
                print(f"  Deal atualizado para 'qualified'")
        except Exception as e:
            print(f"  [WARN] Falha ao atualizar deal: {e}")

    # 4. Update local state
    convos = load_conversations()
    if contact_id and contact_id in convos:
        convos[contact_id]["state"] = STATE_REPLIED
        convos[contact_id]["replied_at"] = datetime.utcnow().isoformat()
        convos[contact_id]["last_reply"] = message_text[:200]
        save_conversations(convos)

    # 5. Notify Moroni
    contact_name = push_name or phone
    if contact_id:
        try:
            c = supabase_get("contacts", {"id": f"eq.{contact_id}", "limit": "1"})
            if c:
                contact_name = c[0].get("name", push_name)
        except Exception:
            pass

    notify_moroni(contact_name, phone, message_text, category)


def main():
    parser = argparse.ArgumentParser(description="SDR Reply Monitor — Reis IA")
    parser.add_argument("--interval", "-i", type=int, default=10,
                        help="Intervalo de polling em segundos (default: 10)")
    args = parser.parse_args()

    print(f"=== SDR REPLY MONITOR ATIVO ===")
    print(f"Polling a cada {args.interval}s")

    # Build phone map of contacted leads
    phone_map = get_contacted_phones()
    replied_phones = get_replied_phones()
    processed_msg_ids = set()
    first_run = True

    print(f"Leads contatados: {len(phone_map) // 2}")  # div 2 because of double-mapping
    print(f"Ja respondidos: {len(replied_phones)}")
    print(f"Monitorando...\n")

    while True:
        try:
            messages = fetch_recent_messages(limit=50)
            now = datetime.now().strftime("%H:%M:%S")

            for msg in messages:
                msg_id = msg.get("key", {}).get("id", "")
                jid = msg.get("key", {}).get("remoteJid", "")
                from_me = msg.get("key", {}).get("fromMe", True)
                push_name = msg.get("pushName", "")

                # Skip already processed
                if msg_id in processed_msg_ids:
                    continue

                # First run: mark all as processed (don't react to old messages)
                if first_run:
                    processed_msg_ids.add(msg_id)
                    continue

                # Skip our own messages
                if from_me or push_name in OUR_NAMES:
                    processed_msg_ids.add(msg_id)
                    continue

                # Skip groups
                if "@g.us" in jid:
                    processed_msg_ids.add(msg_id)
                    continue

                # Try to match to a contacted lead
                phone, conv_data = match_phone(jid, phone_map)

                if not conv_data:
                    processed_msg_ids.add(msg_id)
                    continue

                # Skip if already replied (first reply only triggers notification)
                # But still log subsequent messages
                message_text = (
                    msg.get("message", {}).get("conversation", "") or
                    msg.get("message", {}).get("extendedTextMessage", {}).get("text", "") or
                    "[media/audio]"
                )

                # Process the reply
                process_reply(jid, push_name, message_text, conv_data, phone)
                processed_msg_ids.add(msg_id)

                # Refresh phone map (new contacts may have been added)
                phone_map = get_contacted_phones()

            if first_run:
                first_run = False
                print(f"[{now}] Init OK — {len(processed_msg_ids)} msgs existentes ignoradas")
                print(f"[{now}] Aguardando novas respostas...\n")

            time.sleep(args.interval)

        except KeyboardInterrupt:
            print(f"\nMonitor parado.")
            break
        except Exception as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Erro: {e}")
            time.sleep(30)


if __name__ == "__main__":
    main()
