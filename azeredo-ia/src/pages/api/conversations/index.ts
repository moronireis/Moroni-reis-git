import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const sb = createServerClient();
  const status = url.searchParams.get('status') || 'open';
  const instance_id = url.searchParams.get('instance_id') || '';
  const q = url.searchParams.get('q') || '';
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'));

  let query = sb
    .from('az_conversations')
    .select('*, instance:az_whatsapp_instances(slot_number,display_name,uazapi_name)')
    .eq('status', status)
    .order('last_message_at', { ascending: false })
    .limit(limit);

  if (instance_id) query = query.eq('instance_id', instance_id);
  if (q) query = query.ilike('remote_name', `%${q}%`);

  const { data, error } = await query;
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
