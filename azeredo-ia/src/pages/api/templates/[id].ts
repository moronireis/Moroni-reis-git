import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id required' }, 400);

  const sb = createServerClient();
  const { data, error } = await sb
    .from('az_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return json({ error: 'Template not found' }, 404);
  return json({ template: data });
};

export const PATCH: APIRoute = async ({ locals, params, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id required' }, 400);

  let body: any;
  try { body = await request.json(); } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (body.name !== undefined)     updates.name     = body.name.trim();
  if (body.body !== undefined)     updates.body     = body.body.trim();
  if (body.category !== undefined) updates.category = body.category;

  const sb = createServerClient();
  const { data, error } = await sb
    .from('az_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ template: data });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id required' }, 400);

  const sb = createServerClient();
  const { error } = await sb
    .from('az_templates')
    .delete()
    .eq('id', id);

  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
