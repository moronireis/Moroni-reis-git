import { defineMiddleware } from 'astro:middleware';
import { createClient } from '@supabase/supabase-js';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Allow public paths through without auth check
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return next();
  }

  const accessToken = context.cookies.get('sb-access-token')?.value;
  const refreshToken = context.cookies.get('sb-refresh-token')?.value;

  if (!accessToken) {
    return context.redirect('/login');
  }

  try {
    const sb = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: { user }, error } = await sb.auth.getUser(accessToken);

    if (error || !user) {
      // Try refresh if we have a refresh token
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await sb.auth.refreshSession({
          refresh_token: refreshToken,
        });
        if (refreshError || !refreshData.session) {
          context.cookies.delete('sb-access-token', { path: '/' });
          context.cookies.delete('sb-refresh-token', { path: '/' });
          return context.redirect('/login');
        }
        // Update cookies with refreshed tokens
        const maxAge = 60 * 60 * 24 * 30;
        context.cookies.set('sb-access-token', refreshData.session.access_token, {
          path: '/', httpOnly: true, secure: import.meta.env.PROD, sameSite: 'lax', maxAge,
        });
        context.cookies.set('sb-refresh-token', refreshData.session.refresh_token, {
          path: '/', httpOnly: true, secure: import.meta.env.PROD, sameSite: 'lax', maxAge,
        });

        // Fetch profile with new token
        const sbAdmin = createClient(
          import.meta.env.PUBLIC_SUPABASE_URL,
          import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { persistSession: false } }
        );
        const { data: profile } = await sbAdmin
          .from('az_profiles')
          .select('id, email, full_name, role')
          .eq('id', refreshData.user!.id)
          .single();

        (context.locals as any).profile = profile || { id: refreshData.user!.id, role: 'operador' };
        return next();
      }

      context.cookies.delete('sb-access-token', { path: '/' });
      context.cookies.delete('sb-refresh-token', { path: '/' });
      return context.redirect('/login');
    }

    // Fetch profile from az_profiles
    const sbAdmin = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
    const { data: profile } = await sbAdmin
      .from('az_profiles')
      .select('id, email, full_name, role')
      .eq('id', user.id)
      .single();

    (context.locals as any).profile = profile || { id: user.id, role: 'operador' };
    return next();
  } catch {
    return context.redirect('/login');
  }
});
