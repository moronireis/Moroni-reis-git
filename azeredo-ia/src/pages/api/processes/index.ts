import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const sb = createServerClient();
  const { data, error } = await sb
    .from('az_processes')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;
  if ((profile as any).role !== 'admin')
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const sb = createServerClient();
  const body = await request.json();
  const { title, body: content, category, display_order } = body;

  if (!title || !content) return new Response(JSON.stringify({ error: 'title and body required' }), { status: 400 });

  const { data, error } = await sb
    .from('az_processes')
    .insert({ title, body: content, category: category || 'Geral', display_order: display_order || 0, created_by: (profile as any).id, updated_by: (profile as any).id })
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
