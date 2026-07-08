import type { APIRoute } from 'astro';
import { requireAuth } from '../../../../lib/api-auth';
import { createServerClient } from '../../../../lib/supabase-server';
import { resolveAudience, type SegmentFilter } from '../../../../lib/campaign-audience';

export const prerender = false;

// GET  /api/campaigns/[id]/preview?offset=0&limit=100 — usa o filtro salvo
// POST /api/campaigns/[id]/preview { segment_filter, offset?, limit? } —
//   resolve com o filtro enviado E persiste na campanha (rascunho) na mesma
//   chamada. Um único round-trip elimina a janela PATCH→GET em que cliques
//   rápidos nos filtros intercalavam respostas e mostravam contagem velha.
// Lista de disparo resolvida (mesma lógica do envio real): contatos únicos
// por telefone, já com inclusões/remoções manuais aplicadas.
// Retorna { count, duplicates, contacts: [{id, name, phone, cidade, manual}] }
export const GET: APIRoute = async ({ locals, params, url }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id obrigatório' }, 400);

  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0'));
  const limit  = Math.min(200, Math.max(1, parseInt(url.searchParams.get('limit') || '100')));

  const sb = createServerClient();

  const { data: campaign, error: campErr } = await sb
    .from('az_campaigns')
    .select('segment_filter')
    .eq('id', id)
    .single();

  if (campErr || !campaign) return json({ error: 'Campanha não encontrada' }, 404);

  const filter = (campaign.segment_filter || {}) as SegmentFilter;
  return respondWithAudience(sb, filter, offset, limit);
};

export const POST: APIRoute = async ({ locals, params, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id obrigatório' }, 400);

  let body: any;
  try { body = await request.json(); } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const offset = Math.max(0, parseInt(String(body.offset ?? '0')) || 0);
  const limit  = Math.min(200, Math.max(1, parseInt(String(body.limit ?? '100')) || 100));

  const sb = createServerClient();

  const { data: campaign, error: campErr } = await sb
    .from('az_campaigns')
    .select('status, segment_filter')
    .eq('id', id)
    .single();

  if (campErr || !campaign) return json({ error: 'Campanha não encontrada' }, 404);

  let filter = (campaign.segment_filter || {}) as SegmentFilter;
  if (body.segment_filter && typeof body.segment_filter === 'object') {
    filter = body.segment_filter as SegmentFilter;
    if (campaign.status === 'draft') {
      const { error: saveErr } = await sb
        .from('az_campaigns')
        .update({ segment_filter: filter, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (saveErr) return json({ error: saveErr.message }, 500);
    }
  }

  return respondWithAudience(sb, filter, offset, limit);
};

async function respondWithAudience(
  sb: ReturnType<typeof createServerClient>,
  filter: SegmentFilter,
  offset: number,
  limit: number
) {
  const { audience, error } = await resolveAudience(sb, filter);
  if (error || !audience) return json({ error: error || 'Falha ao resolver contatos' }, 500);

  const page = audience.contacts.slice(offset, offset + limit);

  return json({
    count: audience.contacts.length,
    duplicates: audience.duplicates.length,
    offset,
    contacts: page.map(c => ({
      id: c.id,
      name: c.nome_fantasia || c.razao_social || '—',
      phone: c.phone_primary,
      cidade: c.cidade,
      estado: c.estado,
      contato: c.contato,
      segmento: c.segmento,
      manual: !!c.manual,
    })),
    // compat: amostra usada por versões antigas do wizard
    sample: page.slice(0, 5).map(c => ({
      name: c.nome_fantasia || c.razao_social || '—',
      phone: c.phone_primary,
      cidade: c.cidade,
    })),
  });
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
