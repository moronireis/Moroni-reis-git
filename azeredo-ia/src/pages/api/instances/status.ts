import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

const UAZAPI_URL = import.meta.env.UAZAPI_URL || 'https://u4digital.uazapi.com';

/**
 * GET /api/instances/status?id=INSTANCE_ID
 * Syncs live status from UazapiGO (GET /instance/status) and updates DB.
 * Returns: { status, phone_number, profile_name, profile_pic_url }
 */
export const GET: APIRoute = async ({ locals, url }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const instanceId = url.searchParams.get('id');
  if (!instanceId) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });

  const sb = createServerClient();
  const { data: inst } = await sb
    .from('az_whatsapp_instances')
    .select('token')
    .eq('id', instanceId)
    .single();

  if (!inst) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  try {
    const resp = await fetch(`${UAZAPI_URL}/instance/status`, {
      headers: { token: inst.token },
    });
    const body = await resp.json();
    const instance = body?.instance ?? body;

    const status       = instance?.status === 'connected' ? 'connected' : 'disconnected';
    const phoneNumber  = instance?.phoneNumber ?? instance?.phone ?? null;
    const profileName  = instance?.profileName ?? null;
    const profilePic   = instance?.profilePicUrl ?? null;

    // Sync to DB
    await sb.from('az_whatsapp_instances').update({
      status,
      phone_number: phoneNumber,
      updated_at: new Date().toISOString(),
    }).eq('id', instanceId);

    return new Response(JSON.stringify({ status, phone_number: phoneNumber, profile_name: profileName, profile_pic_url: profilePic }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
