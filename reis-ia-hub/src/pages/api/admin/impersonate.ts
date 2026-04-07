import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const profile = locals.profile;
  if (!profile?.id || profile.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const { user_id } = await request.json();
  if (!user_id) {
    return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 });
  }

  // Store admin's original ID so we can return later
  cookies.set('sb-impersonating-from', profile.id, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 2, // 2 hours max
  });

  // Store the target user ID as the impersonated user
  cookies.set('sb-impersonate-as', user_id, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 2,
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ locals, cookies }) => {
  const profile = locals.profile;
  const impersonatingFrom = cookies.get('sb-impersonating-from')?.value;

  // Only allow stopping impersonation if there's an active session
  if (!impersonatingFrom) {
    return new Response(JSON.stringify({ error: 'Not impersonating' }), { status: 400 });
  }

  cookies.delete('sb-impersonate-as', { path: '/' });
  cookies.delete('sb-impersonating-from', { path: '/' });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
