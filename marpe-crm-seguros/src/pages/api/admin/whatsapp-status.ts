import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  const UAZAPI_URL = import.meta.env.UAZAPI_URL;
  const UAZAPI_TOKEN = import.meta.env.UAZAPI_TOKEN;

  if (!UAZAPI_URL || !UAZAPI_TOKEN) {
    return new Response(JSON.stringify({ connected: false, error: 'Not configured' }), { status: 200 });
  }

  try {
    const res = await fetch(`${UAZAPI_URL}/instance/info?token=${UAZAPI_TOKEN}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ connected: false, status: 'error', http: res.status }), { status: 200 });
    }

    const data = await res.json().catch(() => ({}));
    const connected = data.status === 'connected' || data.connected === true ||
      data.state === 'open' || data.instanceStatus === 'connected';

    return new Response(JSON.stringify({
      connected,
      status: data.status || data.state || data.instanceStatus || 'unknown',
      phone: data.phone || data.wid || data.user?.id || null,
      name: data.pushname || data.name || null,
      raw: data,
    }), { status: 200 });

  } catch (e: any) {
    return new Response(JSON.stringify({ connected: false, error: e.message }), { status: 200 });
  }
};
