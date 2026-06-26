import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const PATCH: APIRoute = async ({ locals, request, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;
  if ((profile as any).role !== 'admin')
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const sb = createServerClient();
  const { id } = params;
  const body = await request.json();
  const { title, body: content, category, display_order } = body;

  const { data, error } = await sb
    .from('az_processes')
    .update({ title, body: content, category, display_order, updated_by: (profile as any).id, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;
  if ((profile as any).role !== 'admin')
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const sb = createServerClient();
  const { id } = params;

  const { error } = await sb
    .from('az_processes')
    .update({ is_active: false })
    .eq('id', id);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
};
