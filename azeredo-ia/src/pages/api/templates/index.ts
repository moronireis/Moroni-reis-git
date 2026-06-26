import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const sb = createServerClient();
  const { data, error } = await sb
    .from('az_templates')
    .select('*')
    .order('name', { ascending: true });

  if (error) return json({ error: error.message }, 500);
  return json({ templates: data || [] });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  let body: any;
  try { body = await request.json(); } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (!body.name?.trim() || !body.body?.trim()) {
    return json({ error: 'name e body são obrigatórios' }, 400);
  }

  const sb = createServerClient();
  const { data, error } = await sb
    .from('az_templates')
    .insert({
      name: body.name.trim(),
      body: body.body.trim(),
      category: body.category || 'geral',
      created_by: profile.id,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ template: data }, 201);
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
