import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

const UAZAPI_URL = import.meta.env.UAZAPI_URL || 'https://u4digital.uazapi.com';

/**
 * GET /api/instances/qr?id=INSTANCE_ID
 *
 * UazapiGO endpoint: POST /instance/connect
 * Response when disconnected: { connected: false, instance: { status: "connecting", qrcode: "data:image/png;base64,..." } }
 * Response when connected:    { connected: true,  instance: { status: "connected", ... } }
 */
export const GET: APIRoute = async ({ locals, url }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const instanceId = url.searchParams.get('id');
  if (!instanceId) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });

  const sb = createServerClient();
  const { data: instance, error } = await sb
    .from('az_whatsapp_instances')
    .select('uazapi_name, token, status')
    .eq('id', instanceId)
    .single();

  if (error || !instance) return new Response(JSON.stringify({ error: 'Instance not found' }), { status: 404 });

  try {
    // Correct UazapiGO endpoint: POST /instance/connect
    const resp = await fetch(`${UAZAPI_URL}/instance/connect`, {
      method: 'POST',
      headers: { token: instance.token, 'Content-Type': 'application/json' },
      body: '{}',
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      return new Response(JSON.stringify({ error: `UazapiGO error ${resp.status}`, detail: errBody }), { status: 502 });
    }

    const body = await resp.json();
    const inst  = body?.instance ?? body;
    const isConnected = body?.connected === true || inst?.status === 'connected';

    if (isConnected) {
      await sb.from('az_whatsapp_instances').update({
        status: 'connected',
        phone_number: inst?.phone ?? inst?.phoneNumber ?? null,
        updated_at: new Date().toISOString(),
      }).eq('id', instanceId);
      return new Response(JSON.stringify({ status: 'connected' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract QR code from instance.qrcode
    const qr = inst?.qrcode || inst?.qr || body?.qrcode || null;

    if (qr) {
      await sb.from('az_whatsapp_instances').update({
        status: 'waiting_qr',
        qr_code: qr,
        updated_at: new Date().toISOString(),
      }).eq('id', instanceId);
    }

    return new Response(JSON.stringify({
      qr,
      status: inst?.status || 'connecting',
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
