import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const UAZAPI_URL = import.meta.env.UAZAPI_URL;
  const UAZAPI_TOKEN = import.meta.env.UAZAPI_TOKEN;

  if (!UAZAPI_URL || !UAZAPI_TOKEN) {
    return json({ connected: false, error: 'Not configured' });
  }

  try {
    const res = await fetch(`${UAZAPI_URL}/instance/status?token=${UAZAPI_TOKEN}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return json({ connected: false, status: 'error', http: res.status });
    }

    const data = await res.json().catch(() => ({}));

    const instance = data.instance || {};
    const statusObj = data.status || {};

    const connected =
      statusObj.connected === true ||
      statusObj.loggedIn === true ||
      instance.status === 'connected';

    return json({
      connected,
      status: instance.status || (connected ? 'connected' : 'disconnected'),
      phone: instance.owner || statusObj.jid?.split(':')[0] || null,
      name: instance.profileName || instance.name || null,
      instanceName: instance.name || null,
      isBusiness: instance.isBusiness || false,
    });
  } catch (e: any) {
    return json({ connected: false, error: e.message });
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
