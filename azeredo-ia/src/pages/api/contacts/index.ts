import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const sb = createServerClient();

  const brand_id  = url.searchParams.get('brand_id') || '';
  const cidade    = url.searchParams.get('cidade') || '';
  const segmento  = url.searchParams.get('segmento') || '';
  const status    = url.searchParams.get('status') || '';
  const q         = url.searchParams.get('q') || '';
  const page      = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit     = Math.min(200, parseInt(url.searchParams.get('limit') || '50'));
  const offset    = (page - 1) * limit;

  // If filtering by brand, first get matching contact_ids
  let contactIdFilter: string[] | null = null;
  if (brand_id) {
    const { data: cb } = await sb
      .from('az_contact_brands')
      .select('contact_id')
      .eq('brand_id', brand_id);
    contactIdFilter = (cb || []).map((r: any) => r.contact_id);
    if (contactIdFilter.length === 0) {
      return json({ contacts: [], total: 0, page, limit });
    }
  }

  // Count query
  let countQuery = sb
    .from('az_contacts')
    .select('id', { count: 'exact', head: true });

  if (contactIdFilter) countQuery = countQuery.in('id', contactIdFilter);
  if (cidade)   countQuery = countQuery.ilike('cidade', `%${cidade}%`);
  if (segmento) countQuery = countQuery.ilike('segmento', `%${segmento}%`);
  if (status)   countQuery = countQuery.eq('status', status);
  if (q)        countQuery = countQuery.or(
    `razao_social.ilike.%${q}%,nome_fantasia.ilike.%${q}%,cnpj.ilike.%${q}%,contato.ilike.%${q}%`
  );

  const { count } = await countQuery;

  // Data query
  let dataQuery = sb
    .from('az_contacts')
    .select('id, razao_social, nome_fantasia, cnpj, phone_primary, phones, email, cidade, estado, segmento, status, contato, created_at')
    .order('razao_social', { ascending: true })
    .range(offset, offset + limit - 1);

  if (contactIdFilter) dataQuery = dataQuery.in('id', contactIdFilter);
  if (cidade)   dataQuery = dataQuery.ilike('cidade', `%${cidade}%`);
  if (segmento) dataQuery = dataQuery.ilike('segmento', `%${segmento}%`);
  if (status)   dataQuery = dataQuery.eq('status', status);
  if (q)        dataQuery = dataQuery.or(
    `razao_social.ilike.%${q}%,nome_fantasia.ilike.%${q}%,cnpj.ilike.%${q}%,contato.ilike.%${q}%`
  );

  const { data: contacts, error } = await dataQuery;
  if (error) return json({ error: error.message }, 500);

  // Attach brands to each contact
  const ids = (contacts || []).map((c: any) => c.id);
  let brands: any[] = [];
  if (ids.length > 0) {
    const { data: cb } = await sb
      .from('az_contact_brands')
      .select('contact_id, az_brands(id, name, slug)')
      .in('contact_id', ids);
    brands = cb || [];
  }

  const brandsByContact: Record<string, any[]> = {};
  for (const row of brands) {
    if (!brandsByContact[row.contact_id]) brandsByContact[row.contact_id] = [];
    if (row.az_brands) brandsByContact[row.contact_id].push(row.az_brands);
  }

  const result = (contacts || []).map((c: any) => ({
    ...c,
    brands: brandsByContact[c.id] || [],
  }));

  return json({ contacts: result, total: count || 0, page, limit });
};

// POST /api/contacts — create a contact (manual entry), optionally linked to brands
export const POST: APIRoute = async ({ locals, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  let body: any;
  try { body = await request.json(); } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const razao_social = (body.razao_social || '').trim();
  if (!razao_social) return json({ error: 'Razão social / nome é obrigatório' }, 400);

  const status = ['ativo', 'inativo_recente', 'inativo_antigo'].includes(body.status)
    ? body.status : 'ativo';

  const sb = createServerClient();

  const insert: Record<string, any> = {
    razao_social,
    nome_fantasia: body.nome_fantasia?.trim() || null,
    cnpj: body.cnpj?.trim() || null,
    phone_primary: body.phone_primary?.trim() || null,
    email: body.email?.trim() || null,
    cidade: body.cidade?.trim() || null,
    estado: body.estado?.trim() || 'RS',
    segmento: body.segmento?.trim() || null,
    contato: body.contato?.trim() || null,
    status,
    source: 'manual',
  };

  const { data: contact, error } = await sb
    .from('az_contacts')
    .insert(insert)
    .select('id, razao_social, nome_fantasia, cnpj, phone_primary, cidade, estado, segmento, status, contato')
    .single();

  if (error) {
    if ((error as any).code === '23505') {
      return json({ error: 'Já existe um contato com este CNPJ' }, 409);
    }
    return json({ error: error.message }, 500);
  }

  // Link brands (M:N)
  const brandIds: string[] = Array.isArray(body.brand_ids) ? body.brand_ids.filter(Boolean) : [];
  if (brandIds.length > 0) {
    const rows = brandIds.map((brand_id: string) => ({ contact_id: contact.id, brand_id }));
    await sb.from('az_contact_brands').insert(rows);
  }

  return json({ contact }, 201);
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
