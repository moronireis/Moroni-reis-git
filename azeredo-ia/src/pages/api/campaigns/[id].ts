import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

// GET /api/campaigns/[id]
export const GET: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id obrigatório' }, 400);

  const sb = createServerClient();

  const { data: campaign, error } = await sb
    .from('az_campaigns')
    .select('id, name, status, total_count, sent_count, failed_count, created_at, started_at, completed_at, template_id, custom_body, segment_filter, az_templates(id, name, body)')
    .eq('id', id)
    .single();

  if (error || !campaign) return json({ error: 'Campanha não encontrada' }, 404);

  // Fetch recipients preview (max 100)
  const { data: recipients } = await sb
    .from('az_campaign_recipients')
    .select('id, contact_id, status, sent_at, error_message, az_contacts(nome_fantasia, razao_social, phone_primary, cidade)')
    .eq('campaign_id', id)
    .limit(100)
    .order('created_at', { ascending: true });

  return json({ campaign, recipients: recipients || [] });
};

// PATCH /api/campaigns/[id]
export const PATCH: APIRoute = async ({ locals, params, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id obrigatório' }, 400);

  let body: any;
  try { body = await request.json(); } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const sb = createServerClient();

  // Only allow edits on draft campaigns
  const { data: existing } = await sb
    .from('az_campaigns')
    .select('status')
    .eq('id', id)
    .single();

  if (!existing) return json({ error: 'Campanha não encontrada' }, 404);
  if (existing.status !== 'draft') return json({ error: 'Só é possível editar campanhas em rascunho' }, 409);

  const updates: Record<string, any> = {};
  if (body.name !== undefined)          updates.name = body.name;
  if (body.custom_body !== undefined)   updates.custom_body = body.custom_body;
  if (body.segment_filter !== undefined) updates.segment_filter = body.segment_filter;

  const { data, error } = await sb
    .from('az_campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ campaign: data });
};

// DELETE /api/campaigns/[id]
export const DELETE: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id obrigatório' }, 400);

  const sb = createServerClient();

  const { data: existing } = await sb
    .from('az_campaigns')
    .select('status')
    .eq('id', id)
    .single();

  if (!existing) return json({ error: 'Campanha não encontrada' }, 404);
  if (existing.status === 'sending') return json({ error: 'Não é possível excluir campanha em andamento' }, 409);

  await sb.from('az_campaign_recipients').delete().eq('campaign_id', id);
  const { error } = await sb.from('az_campaigns').delete().eq('id', id);

  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
