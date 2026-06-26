import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { email?: string; password?: string; remember?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return json({ error: 'Email e senha são obrigatórios.' }, 400);
  }

  const sb = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await sb.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return json({ error: error?.message || 'Falha no login.' }, 401);
  }

  const remember = body.remember === true;
  const accessMaxAge  = remember ? 60 * 60 * 24 * 90 : 60 * 60 * 8;
  const refreshMaxAge = remember ? 60 * 60 * 24 * 90 : 60 * 60 * 24;

  cookies.set('sb-access-token', data.session.access_token, {
    path: '/', httpOnly: true, secure: import.meta.env.PROD, sameSite: 'lax', maxAge: accessMaxAge,
  });
  cookies.set('sb-refresh-token', data.session.refresh_token, {
    path: '/', httpOnly: true, secure: import.meta.env.PROD, sameSite: 'lax', maxAge: refreshMaxAge,
  });

  return json({ ok: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
