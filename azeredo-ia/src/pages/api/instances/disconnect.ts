import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

const UAZAPI_URL = import.meta.env.UAZAPI_URL || 'https://u4digital.uazapi.com';

/**
 * POST /api/instances/disconnect
 * Body: { id: INSTANCE_ID }
 * Calls POST /instance/disconnect on UazapiGO and updates DB status.
 */
export const POST: APIRoute = async ({ locals, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;
  if ((profile as any).role !== 'admin')
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

  const { id } = await request.json();
  if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });

  const sb = createServerClient();
  const { data: inst } = await sb
    .from('az_whatsapp_instances')
    .select('token, uazapi_name')
    .eq('id', id)
    .single();

  if (!inst) return new Response(JSON.stringify({ error: 'Instance not found' }), { status: 404 });

  try {
    const resp = await fetch(`${UAZAPI_URL}/instance/disconnect`, {
      method: 'POST',
      headers: { token: inst.token, 'Content-Type': 'application/json' },
      body: '{}',
    });
    const body = await resp.json();

    // Update DB regardless of UazapiGO response
    await sb.from('az_whatsapp_instances').update({
      status: 'disconnected',
      qr_code: null,
      updated_at: new Date().toISOString(),
    }).eq('id', id);

    return new Response(JSON.stringify({ ok: true, detail: body }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
