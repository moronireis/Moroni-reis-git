#!/usr/bin/env node
/**
 * Import da "Carteira detalhada de clientes" (Mercos) — 1 arquivo .xls por
 * representada. Alimenta A1a (última compra / situação real) e M3 passo 1
 * (vendedor por cliente, campo limpo vendedor_principal).
 *
 * Uso:
 *   node scripts/import-relacao-clientes.mjs "/caminho/para/RELAÇÃO AZEREDO" [--dry]
 *
 * Formato esperado (relatório Mercos):
 *   linha 3:  "Representada: <marca>"
 *   linha 8:  cabeçalho (Razão Social, Nome fantasia, CNPJ/CPF, Telefone,
 *             Último pedido, Data do último pedido, Vendedor do último pedido,
 *             Valor do último pedido, Dias sem comprar, Ciclo médio, Situação)
 *   linha 9+: dados
 *
 * O que faz:
 *   - casa a marca do arquivo com az_brands (nome exato ou prefixo)
 *   - casa o cliente com az_contacts por CNPJ (dígitos); fallback: telefone
 *   - upsert em az_contact_brands (situacao, ultima_compra_at, vendedor, …)
 *   - agrega em az_contacts: status = melhor situação entre as marcas,
 *     ultima_compra_at = mais recente, vendedor_principal = vendedor do
 *     pedido mais recente
 *   - reporta não-casados para validação com a Tati
 *
 * Credenciais: lê PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY do
 * .env.local do projeto (nunca hardcode).
 */
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── env ──────────────────────────────────────────────────────────────────────
const env = {};
for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)="?([^"\n]*)"?$/);
  // valores do `vercel env pull` carregam um "\n" LITERAL no fim — remover
  if (m) env[m[1]] = m[2].replace(/\\n$/, '').trim();
}
const sb = createClient(env.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const dir = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!dir) { console.error('Uso: node scripts/import-relacao-clientes.mjs <pasta> [--dry]'); process.exit(1); }

// ── helpers ──────────────────────────────────────────────────────────────────
const digits = (v) => String(v ?? '').replace(/\D/g, '');

const SITUACAO = {
  'ativo': 'ativo',
  'inativo recente': 'inativo_recente',
  'inativo antigo': 'inativo_antigo',
};
const RANK = { ativo: 3, inativo_recente: 2, inativo_antigo: 1 };

function parseDate(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') { // serial Excel
    const d = new Date(Math.round((v - 25569) * 86400 * 1000));
    return isNaN(d) ? null : d.toISOString().slice(0, 10);
  }
  const m = String(v).trim().match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

// telefone BR → candidatos p/ casar com o banco (com/sem 55, com/sem o 9)
function phoneCandidates(raw) {
  let d = digits(raw).replace(/^0+/, '');
  if (!d) return [];
  if (d.length === 10 || d.length === 11) d = '55' + d;
  const out = new Set([d]);
  if (d.startsWith('55')) {
    if (d.length === 13 && d[4] === '9') out.add(d.slice(0, 4) + d.slice(5));
    if (d.length === 12) out.add(d.slice(0, 4) + '9' + d.slice(4));
  }
  return [...out];
}

// ── carrega banco ─────────────────────────────────────────────────────────────
async function loadAll(table, select) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from(table).select(select).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

const contacts = await loadAll('az_contacts', 'id, cnpj, phone_primary, phones, razao_social');
const brands = await loadAll('az_brands', 'id, name');

const byCnpj = new Map();
const byPhone = new Map();
for (const c of contacts) {
  const d = digits(c.cnpj);
  if (d) byCnpj.set(d, c.id);
  for (const p of [c.phone_primary, ...(c.phones || [])]) {
    for (const v of phoneCandidates(p)) if (!byPhone.has(v)) byPhone.set(v, c.id);
  }
}

function matchBrand(rep) {
  const r = rep.toLowerCase().replace(/\s+/g, ' ').trim();
  let b = brands.find(x => x.name.toLowerCase() === r);
  if (!b) b = brands.find(x => r.startsWith(x.name.toLowerCase()) || x.name.toLowerCase().startsWith(r));
  return b || null;
}

// ── parse dos arquivos ────────────────────────────────────────────────────────
const files = readdirSync(dir).filter(f => /\.xlsx?$/i.test(f));
const links = [];            // rows p/ az_contact_brands
const perContact = new Map(); // contact_id → agregados
const unmatched = [];
const brandMiss = [];
let totalRows = 0;

for (const f of files) {
  const wb = XLSX.readFile(join(dir, f));
  const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: null });
  const rep = String(data[3]?.[0] || '').replace(/^Representada:/i, '').trim();
  const header = data[8] || [];
  if (String(header[0]).trim() !== 'Razão Social') {
    console.error(`!! ${f}: formato inesperado (cabeçalho na linha 9 = ${JSON.stringify(header[0])}) — pulado`);
    continue;
  }
  const brand = matchBrand(rep);
  if (!brand) { brandMiss.push(`${f} → "${rep}"`); continue; }

  for (const r of data.slice(9)) {
    if (!r[0]) continue;
    totalRows++;
    const cnpjD = digits(r[2]);
    let contactId = cnpjD ? byCnpj.get(cnpjD) : null;
    if (!contactId) {
      for (const v of phoneCandidates(r[3])) {
        if (byPhone.has(v)) { contactId = byPhone.get(v); break; }
      }
    }
    if (!contactId) {
      unmatched.push({ arquivo: f, razao: r[0], cnpj: r[2], fone: r[3], situacao: r[10] });
      continue;
    }

    const situacao = SITUACAO[String(r[10] || '').toLowerCase().trim()] || null;
    const dataPedido = parseDate(r[5]);
    const vendedor = r[6] ? String(r[6]).trim() : null;

    links.push({
      contact_id: contactId,
      brand_id: brand.id,
      situacao,
      ultima_compra_at: dataPedido,
      vendedor,
      dias_sem_comprar: Number.isFinite(Number(r[8])) ? Math.round(Number(r[8])) : null,
      ciclo_medio_dias: Number.isFinite(Number(r[9])) ? Number(r[9]) : null,
      valor_ultimo_pedido: Number.isFinite(Number(r[7])) ? Number(r[7]) : null,
      ultimo_pedido_numero: r[4] ? String(r[4]) : null,
    });

    // agregado por contato
    const agg = perContact.get(contactId) || { best: null, lastDate: null, vendedor: null };
    if (situacao && (!agg.best || RANK[situacao] > RANK[agg.best])) agg.best = situacao;
    if (dataPedido && (!agg.lastDate || dataPedido > agg.lastDate)) {
      agg.lastDate = dataPedido;
      if (vendedor) agg.vendedor = vendedor;
    } else if (!agg.vendedor && vendedor) {
      agg.vendedor = vendedor;
    }
    perContact.set(contactId, agg);
  }
}

console.log(`arquivos: ${files.length} · linhas: ${totalRows} · casadas: ${links.length} · não-casadas: ${unmatched.length}`);
if (brandMiss.length) console.log('MARCAS SEM MATCH:', brandMiss);

// Dedupe contato×marca (duas linhas do arquivo podem casar no mesmo contato
// — ex.: fallback por telefone). Fica a de pedido mais recente; empate → melhor situação.
const byPair = new Map();
for (const l of links) {
  const key = `${l.contact_id}|${l.brand_id}`;
  const cur = byPair.get(key);
  if (!cur) { byPair.set(key, l); continue; }
  const newer = (l.ultima_compra_at || '') > (cur.ultima_compra_at || '') ||
    ((l.ultima_compra_at || '') === (cur.ultima_compra_at || '') && (RANK[l.situacao] || 0) > (RANK[cur.situacao] || 0));
  if (newer) byPair.set(key, l);
}
const dedupedLinks = [...byPair.values()];
if (dedupedLinks.length !== links.length) {
  console.log(`dedupe contato×marca: ${links.length} → ${dedupedLinks.length}`);
}
links.length = 0;
links.push(...dedupedLinks);

if (DRY) {
  console.log('[dry-run] nada gravado. Amostra:', JSON.stringify(links[0], null, 2));
  process.exit(0);
}

// ── grava az_contact_brands (upsert na unique contact_id+brand_id) ───────────
for (let i = 0; i < links.length; i += 400) {
  const chunk = links.slice(i, i + 400);
  const { error } = await sb.from('az_contact_brands').upsert(chunk, { onConflict: 'contact_id,brand_id' });
  if (error) { console.error(`upsert vínculos ${i}: ${error.message}`); process.exit(1); }
  process.stdout.write(`vínculos ${Math.min(i + 400, links.length)}/${links.length}\r`);
}
console.log(`\nvínculos gravados: ${links.length}`);

// ── agrega em az_contacts ─────────────────────────────────────────────────────
const updates = [...perContact.entries()].map(([id, a]) => ({
  id,
  status: a.best || 'inativo_antigo',
  ultima_compra_at: a.lastDate,
  vendedor_principal: a.vendedor,
}));

let done = 0;
for (let i = 0; i < updates.length; i += 25) {
  await Promise.all(updates.slice(i, i + 25).map(u =>
    sb.from('az_contacts')
      .update({ status: u.status, ultima_compra_at: u.ultima_compra_at, vendedor_principal: u.vendedor_principal, updated_at: new Date().toISOString() })
      .eq('id', u.id)
  ));
  done = Math.min(i + 25, updates.length);
  process.stdout.write(`contatos ${done}/${updates.length}\r`);
}
console.log(`\ncontatos atualizados: ${updates.length} (de ${contacts.length} na base — os demais não aparecem em nenhuma carteira e ficaram como estavam)`);

const dist = {};
for (const u of updates) dist[u.status] = (dist[u.status] || 0) + 1;
console.log('status aplicados:', JSON.stringify(dist));

if (unmatched.length) {
  const out = join(ROOT, 'scripts', `relacao-nao-casados-${new Date().toISOString().slice(0, 10)}.json`);
  writeFileSync(out, JSON.stringify(unmatched, null, 2));
  console.log(`não-casados salvos p/ validação com a Tati: ${out}`);
}
