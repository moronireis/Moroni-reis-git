#!/usr/bin/env python3
"""
SDR Outreach — Reis IA
Sends personalized WhatsApp messages to CRM leads, one by one.

Usage:
    python sdr-outreach.py test                           # Send 1 msg per category to Moroni
    python sdr-outreach.py test --category marketing      # Test specific category
    python sdr-outreach.py dry-run --category marketing   # Preview messages without sending
    python sdr-outreach.py live --category marketing      # Send to real leads (default limit 5)
    python sdr-outreach.py live --category marketing --limit 10
    python sdr-outreach.py live --category all --limit 5  # All categories
    python sdr-outreach.py status                         # Show outreach stats
"""

import sys
import time
import random
import argparse
from datetime import datetime

from sdr_config import (
    MORONI_PHONE,
    CATEGORY_MAP,
    STATE_FIRST_SENT,
    STATE_NOT_CONTACTED,
    send_whatsapp,
    fetch_contacts_by_product,
    update_contact,
    log_sdr_conversation,
    create_or_update_deal,
    load_conversations,
    save_conversations,
    supabase_get,
    supabase_count,
    get_first_name,
)


def get_already_contacted():
    """Get set of contact IDs already contacted via sdr_conversations."""
    try:
        records = supabase_get("sdr_conversations", {
            "direction": "eq.outbound",
            "select": "contact_id",
            "limit": "5000",
        })
        return {r["contact_id"] for r in records if r.get("contact_id")}
    except Exception:
        # Fallback to local JSON
        convos = load_conversations()
        return {cid for cid, c in convos.items() if c.get("state") != STATE_NOT_CONTACTED}


def send_to_lead(contact, category, dry_run=False):
    """Craft and send a personalized message to a lead."""
    cat_config = CATEGORY_MAP[category]
    generate_fn = cat_config["generate_fn"]
    name = get_first_name(contact.get("name"))
    phone = contact.get("phone", "").replace("+", "").replace(" ", "").replace("-", "")

    if not phone:
        print(f"  SKIP: {contact.get('name')} — sem telefone")
        return False

    # Generate personalized message
    msg = generate_fn(contact)

    if dry_run:
        print(f"\n{'='*60}")
        print(f"  PARA: {name} ({phone})")
        print(f"  EMPRESA: {contact.get('company', 'N/A')}")
        print(f"  CARGO: {contact.get('cargo', 'N/A')}")
        print(f"  FATURAMENTO: {contact.get('faturamento', 'N/A')}")
        print(f"  OBJETIVO: {contact.get('objetivo', 'N/A')}")
        print(f"  TAGS: {contact.get('tags', [])}")
        print(f"  SCORE: {contact.get('opportunity_score', 'N/A')}")
        print(f"{'='*60}")
        print(msg)
        print(f"{'='*60}\n")
        return True

    # Send via Evolution API
    print(f"  Enviando para {name} ({phone})...")
    try:
        status, resp = send_whatsapp(phone, msg)
        msg_id = resp.get("key", {}).get("id", "N/A")

        if status in (200, 201):
            print(f"  OK — ID: {msg_id}")

            # Log to Supabase sdr_conversations
            log_sdr_conversation(
                contact_id=contact.get("id"),
                contact_phone=phone,
                direction="outbound",
                message_text=msg,
                category=category,
                state=STATE_FIRST_SENT,
                extra={"msg_id": msg_id, "contact_name": contact.get("name")},
            )

            # Update contact notes in CRM
            current_notes = contact.get("notes", "") or ""
            sdr_note = f"[SDR {datetime.now().strftime('%d/%m/%Y %H:%M')}] Primeira mensagem enviada via WhatsApp"
            update_contact(contact["id"], {
                "notes": f"{current_notes}\n{sdr_note}".strip(),
            })

            # Create/update deal
            create_or_update_deal(contact, category)

            # Update local state
            convos = load_conversations()
            convos[contact["id"]] = {
                "name": contact.get("name"),
                "phone": phone,
                "category": category,
                "state": STATE_FIRST_SENT,
                "first_sent_at": datetime.utcnow().isoformat(),
                "msg_id": msg_id,
            }
            save_conversations(convos)

            return True
        else:
            print(f"  ERRO: status {status} — {resp}")
            return False

    except Exception as e:
        print(f"  ERRO: {e}")
        return False


def run_test(category=None):
    """Send test messages to Moroni's number."""
    categories = [category] if category else list(CATEGORY_MAP.keys())

    print(f"\n=== MODO TESTE ===")
    print(f"Enviando para Moroni ({MORONI_PHONE})")
    print(f"Categorias: {', '.join(categories)}\n")

    for cat in categories:
        cat_config = CATEGORY_MAP[cat]
        generate_fn = cat_config["generate_fn"]

        # Build a fake contact with Moroni's data for testing
        test_contact = {
            "id": "test-moroni",
            "name": "Moroni",
            "phone": MORONI_PHONE,
            "company": "Reis IA",
            "cargo": "CEO",
            "faturamento": "Mais de R$30 mil",
            "objetivo": "escalar operacao com IA",
            "tags": ["Diagnóstico", "AI Hunters"],
            "form_type": "diagnostico",
            "opportunity_score": 95,
        }

        msg = generate_fn(test_contact)

        print(f"--- [{cat_config['label']}] ---")
        print(msg)
        print(f"---\n")

        status, resp = send_whatsapp(MORONI_PHONE, msg)
        msg_id = resp.get("key", {}).get("id", "N/A")
        print(f"Status: {status} | ID: {msg_id}\n")

        if len(categories) > 1:
            delay = random.uniform(5, 8)
            print(f"Aguardando {delay:.1f}s...\n")
            time.sleep(delay)

    print("Teste concluido. Verifique as mensagens no WhatsApp.")


def run_live(category, limit, dry_run=False):
    """Send outreach to real leads from CRM."""
    if category == "all":
        categories = list(CATEGORY_MAP.keys())
    else:
        categories = [category]

    already_contacted = get_already_contacted()
    mode_label = "DRY-RUN" if dry_run else "LIVE"

    print(f"\n=== MODO {mode_label} ===")
    print(f"Categorias: {', '.join(categories)}")
    print(f"Limite por categoria: {limit}")
    print(f"Ja contatados: {len(already_contacted)}\n")

    total_sent = 0
    total_skipped = 0

    for cat in categories:
        cat_config = CATEGORY_MAP[cat]
        product_filter = cat_config["product_filter"]

        print(f"\n--- {cat_config['label']} ---")

        # Fetch contacts from CRM
        contacts = fetch_contacts_by_product(product_filter, has_phone=True, limit=limit + 50)
        print(f"Contatos encontrados: {len(contacts)}")

        # Filter out already contacted
        new_contacts = [c for c in contacts if c.get("id") not in already_contacted]
        print(f"Novos (nao contatados): {len(new_contacts)}")

        # Apply limit
        batch = new_contacts[:limit]
        print(f"Batch atual: {len(batch)}\n")

        sent = 0
        for i, contact in enumerate(batch, 1):
            print(f"[{i}/{len(batch)}] {contact.get('name', 'N/A')} — {contact.get('company', 'N/A')}")

            success = send_to_lead(contact, cat, dry_run=dry_run)

            if success:
                sent += 1
                already_contacted.add(contact.get("id"))
            else:
                total_skipped += 1

            # Delay between messages (only in live mode)
            if not dry_run and i < len(batch):
                delay = random.uniform(10, 18)
                print(f"  Aguardando {delay:.1f}s...\n")
                time.sleep(delay)

        total_sent += sent
        print(f"\n{cat_config['label']}: {sent} enviadas, {len(batch) - sent} falhas/skips")

    print(f"\n{'='*40}")
    print(f"TOTAL: {total_sent} mensagens {'previewed' if dry_run else 'enviadas'}")
    print(f"SKIPS: {total_skipped}")
    print(f"{'='*40}\n")


def show_status():
    """Show current outreach status from Supabase."""
    print("\n=== SDR OUTREACH STATUS ===\n")

    for cat_name, cat_config in CATEGORY_MAP.items():
        product = cat_config["product_filter"]
        label = cat_config["label"]

        # Total contacts in category
        try:
            total = supabase_count("contacts", {
                "best_fit_product": f"eq.{product}",
                "phone": "neq.",
            })
        except Exception:
            total = "?"

        # Already contacted
        try:
            contacted = supabase_count("sdr_conversations", {
                "category": f"eq.{cat_name}",
                "direction": "eq.outbound",
            })
        except Exception:
            contacted = "?"

        # Replies received
        try:
            replies = supabase_count("sdr_conversations", {
                "category": f"eq.{cat_name}",
                "direction": "eq.inbound",
            })
        except Exception:
            replies = "?"

        print(f"  {label}:")
        print(f"    Total com telefone: {total}")
        print(f"    Contatados:         {contacted}")
        print(f"    Respostas:          {replies}")
        remaining = total - contacted if isinstance(total, int) and isinstance(contacted, int) else "?"
        print(f"    Restantes:          {remaining}")
        print()

    # Local state summary
    convos = load_conversations()
    states = {}
    for c in convos.values():
        s = c.get("state", "unknown")
        states[s] = states.get(s, 0) + 1

    if states:
        print("  Estado das conversas (local):")
        for state, count in sorted(states.items()):
            print(f"    {state}: {count}")
    print()


def main():
    parser = argparse.ArgumentParser(description="SDR Outreach — Reis IA")
    parser.add_argument("mode", choices=["test", "live", "dry-run", "status"],
                        help="Modo de execucao")
    parser.add_argument("--category", "-c", default="all",
                        choices=["marketing", "systems", "mentoria", "all"],
                        help="Categoria de leads")
    parser.add_argument("--limit", "-l", type=int, default=5,
                        help="Limite de mensagens por categoria (default: 5)")

    args = parser.parse_args()

    if args.mode == "test":
        cat = args.category if args.category != "all" else None
        run_test(cat)
    elif args.mode == "dry-run":
        run_live(args.category, args.limit, dry_run=True)
    elif args.mode == "live":
        run_live(args.category, args.limit, dry_run=False)
    elif args.mode == "status":
        show_status()


if __name__ == "__main__":
    main()
