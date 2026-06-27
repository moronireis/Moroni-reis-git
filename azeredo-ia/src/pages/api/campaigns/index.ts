import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

// GET /api/campaigns?page=1&limit=20
export const GET: APIRoute = async ({ locals, url }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const page  = Math.max(1, parseInt(url.searchParams.get('page')  || '1'));
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '20'));
  const offset = (page - 1) * limit;

  const sb = createServerClient();

  const { data, error, count } = await sb
    .from('az_campaigns')
    .select('id, name, status, total_count, sent_count, failed_count, created_at, started_at, completed_at, az_templates(name), az_whatsapp_instances(slot_number, display_name, uazapi_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return json({ error: error.message }, 500);

  return json({ campaigns: data || [], total: count || 0 });
};

// POST /api/campaigns
export const POST: APIRoute = async ({ locals, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  let body: any;
  try { body = await request.json(); } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const { name, template_id, custom_body, segment_filter, instance_id } = body;

  if (!name?.trim()) return json({ error: 'Nome é obrigatório' }, 400);
  if (!template_id && !custom_body?.trim()) {
    return json({ error: 'Informe um template ou escreva a mensagem' }, 400);
  }

  const sb = createServerClient();

  const { data, error } = await sb
    .from('az_campaigns')
    .insert({
      name: name.trim(),
      template_id: template_id || null,
      custom_body: custom_body?.trim() || null,
      segment_filter: segment_filter || {},
      instance_id: instance_id || null,
      status: 'draft',
      created_by: (profile as any).id,
    })
    .select('id, name, status, total_count, sent_count, failed_count, created_at, started_at, completed_at')
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ campaign: data }, 201);
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
