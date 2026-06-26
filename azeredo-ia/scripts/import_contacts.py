"""
import_contacts.py — Azeredo IA
Reads 25 XLS files from OneDrive export and imports contacts into Supabase.

Tables: az_contacts, az_contact_brands
Deduplication key: CNPJ (digits only)
Strategy: batch upserts (100 rows at a time) for speed.
"""

from __future__ import annotations

import os
import re
import sys
import time
import xlrd
import requests
from pathlib import Path
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

XLS_DIR = Path(
    "/Users/moronireis/Downloads/OneDrive_1_25-06-2026"
    "/RELAÇÃO CLIENTES-REPRESENTADAS"
)

BRAND_MAP = {
    "relatorio ACRIMET.xls": "acrimet",
    "relatorio AMOEBA.xls": "amoeba",
    "relatorio BAMBOLA.xls": "bambola",
    "relatorio BONUS.xls": "bonus",
    "relatorio BR DECOR.xls": "br-decor",
    "relatorio BS.xls": "bs-toys",
    "relatorio BUBA.xls": "buba",
    "relatorio FESTA CHIC.xls": "festa-chic",
    "relatorio INGA.xls": "inga",
    "relatorio KRIAT.xls": "kriat",
    "relatorio MERCO TOYS.xls": "mercotoys",
    "relatorio NATHOR.xls": "nathor",
    "relatorio NEOPLAS.xls": "neoplas",
    "relatorio PMI.xls": "pmi",
    "relatorio POLIBRAS.xls": "polibras",
    "relatorio REI DO BALDE.xls": "rei-do-balde",
    "relatorio RIBERBALL.xls": "riberball",
    "relatorio RISCHIOTO.xls": "rischioto",
    "relatorio SERT PLAST.xls": "sert-plast",
    "relatorio SICAD=EUROCEL.xls": "sicad-eurocel",
    "relatorio SILMAR.xls": "silmar",
    "relatorio TILIBRA.xls": "tilibra",
    "relatorio TOYNG.xls": "toyng",
    "relatorio TRIK TRIK.xls": "trik-trik",
    "relatorio WOW TOYS.xls": "wowtoys",
}

COL_RAZAO_SOCIAL = 0
COL_NOME_FANTASIA = 1
COL_CNPJ = 2
COL_TELEFONES = 5
COL_EMAILS = 6
COL_ENDERECO = 7
COL_CIDADE = 8
COL_ESTADO = 9
COL_CONTATO = 10
COL_SEGMENTO = 11
COL_VENDEDORES = 12

DATA_START_ROW = 6
BATCH_SIZE = 100

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SERVICE_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.")
    sys.exit(1)

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=representation",
}

# ---------------------------------------------------------------------------
# Phone normalization
# ---------------------------------------------------------------------------

def normalize_phone(raw: str) -> str | None:
    digits = re.sub(r"\D", "", raw)
    if not digits:
        return None
    digits = digits.lstrip("0")
    if not digits:
        return None
    if digits.startswith("55") and len(digits) in (12, 13):
        return digits
    if len(digits) in (10, 11):
        return "55" + digits
    return None


def parse_phones(raw: str) -> tuple[str | None, list[str]]:
    parts = [p.strip() for p in raw.split(",") if p.strip()]
    normalized = [n for p in parts if (n := normalize_phone(p)) is not None]
    seen: set[str] = set()
    unique: list[str] = []
    for n in normalized:
        if n not in seen:
            seen.add(n)
            unique.append(n)
    primary = None
    for n in unique:
        if len(n) == 13 and n[4] == "9":
            primary = n
            break
    if primary is None and unique:
        primary = unique[0]
    return primary, unique


def normalize_cnpj(raw: str) -> str | None:
    digits = re.sub(r"\D", "", str(raw))
    if len(digits) < 11:
        return None
    return digits


# ---------------------------------------------------------------------------
# Supabase helpers
# ---------------------------------------------------------------------------

def rest_upsert_batch(table: str, rows: list[dict], on_conflict: str) -> list[dict]:
    if not rows:
        return []
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    resp = requests.post(
        url,
        headers=HEADERS,
        params={"on_conflict": on_conflict},
        json=rows,
        timeout=60,
    )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Batch upsert [{resp.status_code}] {table}: {resp.text[:400]}")
    return resp.json()


def rest_get(path: str, params: dict | None = None) -> list:
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    resp = requests.get(url, headers=HEADERS, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


# ---------------------------------------------------------------------------
# Cell helpers
# ---------------------------------------------------------------------------

def cell_str(sheet, row: int, col: int) -> str:
    try:
        cell = sheet.cell(row, col)
    except IndexError:
        return ""
    if cell.ctype == xlrd.XL_CELL_EMPTY:
        return ""
    if cell.ctype == xlrd.XL_CELL_NUMBER:
        return str(int(cell.value))
    return str(cell.value).strip()


# ---------------------------------------------------------------------------
# Parse a single XLS file → list of (contact_dict, brand_slug, vendedores)
# ---------------------------------------------------------------------------

def parse_file(xls_path: Path, brand_slug: str) -> list[tuple[dict, str, list[str]]]:
    wb = xlrd.open_workbook(str(xls_path))
    try:
        sh = wb.sheet_by_name("Relatório")
    except xlrd.XLRDError:
        sh = wb.sheet_by_index(0)

    rows = []
    for row_idx in range(DATA_START_ROW, sh.nrows):
        razao_social = cell_str(sh, row_idx, COL_RAZAO_SOCIAL)
        if not razao_social:
            continue
        raw_cnpj = cell_str(sh, row_idx, COL_CNPJ)
        cnpj = normalize_cnpj(raw_cnpj)
        if cnpj is None:
            continue

        raw_phones = cell_str(sh, row_idx, COL_TELEFONES)
        raw_emails = cell_str(sh, row_idx, COL_EMAILS)
        primary_phone, all_phones = parse_phones(raw_phones)
        emails = [e.strip().lower() for e in raw_emails.split(",") if e.strip()]
        vendedores_raw = cell_str(sh, row_idx, COL_VENDEDORES)
        vendedores = [v.strip() for v in vendedores_raw.split(",") if v.strip()]

        contact = {
            "cnpj": cnpj,
            "razao_social": razao_social,
            "nome_fantasia": cell_str(sh, row_idx, COL_NOME_FANTASIA) or None,
            "phone_primary": primary_phone,
            "phones": all_phones,
            "email": emails[0] if emails else None,
            "endereco": cell_str(sh, row_idx, COL_ENDERECO) or None,
            "cidade": cell_str(sh, row_idx, COL_CIDADE) or None,
            "estado": cell_str(sh, row_idx, COL_ESTADO) or "RS",
            "contato": cell_str(sh, row_idx, COL_CONTATO) or None,
            "segmento": cell_str(sh, row_idx, COL_SEGMENTO) or None,
        }
        rows.append((contact, brand_slug, vendedores))
    return rows


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("=== Azeredo IA — Import Contacts ===", flush=True)
    print(f"Source: {XLS_DIR}", flush=True)
    print(f"Supabase: {SUPABASE_URL}", flush=True)
    print(flush=True)

    # Load brand IDs
    print("Carregando brand IDs...", flush=True)
    brand_rows = rest_get("az_brands", params={"select": "id,slug"})
    brand_ids = {r["slug"]: r["id"] for r in brand_rows}
    print(f"  {len(brand_ids)} marcas: {sorted(brand_ids.keys())}", flush=True)
    print(flush=True)

    # Parse ALL files → deduplicate contacts by CNPJ
    # contact_data[cnpj] = latest contact dict
    # brand_links[cnpj] = [(brand_slug, vendedores), ...]
    contact_data: dict[str, dict] = {}
    brand_links: dict[str, list[tuple[str, list[str]]]] = {}
    skipped = 0
    files_ok = 0
    files_missing = 0

    for filename, slug in sorted(BRAND_MAP.items()):
        xls_path = XLS_DIR / filename
        if not xls_path.exists():
            print(f"  [MISSING] {filename}", flush=True)
            files_missing += 1
            continue

        print(f"  Lendo: {filename}...", end=" ", flush=True)
        rows = parse_file(xls_path, slug)
        count = 0
        for contact, brand_slug, vendedores in rows:
            cnpj = contact["cnpj"]
            if cnpj not in contact_data:
                contact_data[cnpj] = contact
            # else: keep first occurrence (already in dict), but still add brand link
            if cnpj not in brand_links:
                brand_links[cnpj] = []
            brand_links[cnpj].append((brand_slug, vendedores))
            count += 1
        print(f"{count} registros", flush=True)
        files_ok += 1

    print(flush=True)
    print(f"Total contatos únicos (por CNPJ): {len(contact_data)}", flush=True)
    print(f"Total vínculos marca-contato: {sum(len(v) for v in brand_links.values())}", flush=True)
    print(flush=True)

    # --- Batch upsert az_contacts ---
    print("Inserindo contatos no Supabase (batches de 100)...", flush=True)
    all_contacts = list(contact_data.values())
    cnpj_to_id: dict[str, str] = {}
    inserted = 0

    for i in range(0, len(all_contacts), BATCH_SIZE):
        batch = all_contacts[i:i + BATCH_SIZE]
        result = rest_upsert_batch("az_contacts", batch, "cnpj")
        for row in result:
            cnpj_to_id[row["cnpj"]] = row["id"]
        inserted += len(result)
        print(f"  Contatos: {inserted}/{len(all_contacts)}", flush=True)

    print(f"  ✓ {inserted} contatos upsertados", flush=True)
    print(flush=True)

    # --- Batch upsert az_contact_brands ---
    print("Inserindo vínculos marca-contato...", flush=True)
    link_rows = []
    for cnpj, links in brand_links.items():
        contact_id = cnpj_to_id.get(cnpj)
        if contact_id is None:
            continue
        for brand_slug, vendedores in links:
            brand_id = brand_ids.get(brand_slug)
            if brand_id is None:
                continue
            link_rows.append({
                "contact_id": contact_id,
                "brand_id": brand_id,
                "vendedores": vendedores,
            })

    links_inserted = 0
    for i in range(0, len(link_rows), BATCH_SIZE):
        batch = link_rows[i:i + BATCH_SIZE]
        rest_upsert_batch("az_contact_brands", batch, "contact_id,brand_id")
        links_inserted += len(batch)
        print(f"  Vínculos: {links_inserted}/{len(link_rows)}", flush=True)

    print(f"  ✓ {links_inserted} vínculos upsertados", flush=True)
    print(flush=True)

    print("=" * 50, flush=True)
    print("RESUMO FINAL", flush=True)
    print(f"  Arquivos processados : {files_ok}", flush=True)
    print(f"  Arquivos ausentes    : {files_missing}", flush=True)
    print(f"  Contatos únicos      : {len(contact_data)}", flush=True)
    print(f"  Contatos no Supabase : {inserted}", flush=True)
    print(f"  Vínculos inseridos   : {links_inserted}", flush=True)
    print("=" * 50, flush=True)


if __name__ == "__main__":
    main()
