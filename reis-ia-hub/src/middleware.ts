import { defineMiddleware } from 'astro:middleware';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from './lib/supabase-server';

const publicPaths = ['/login', '/register', '/obrigado', '/'];

let _anonClient: SupabaseClient | null = null;
function getAnonClient() {
  if (!_anonClient) {
    _anonClient = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return _anonClient;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return next();
  }

  // Allow API auth routes (they manage cookies themselves)
  if (pathname.startsWith('/api/auth')) {
    return next();
  }

  // Allow webhook routes (they use their own auth via x-webhook-key header)
  if (pathname.startsWith('/api/webhook') || pathname.startsWith('/api/leads/webhook')) {
    return next();
  }

  // Get access token from cookie
  const accessToken = context.cookies.get('sb-access-token')?.value;
  const refreshToken = context.cookies.get('sb-refresh-token')?.value;

  if (!accessToken) {
    return context.redirect('/login');
  }

  // Verify session using anon client
  const supabase = getAnonClient();

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    // Try refresh
    if (refreshToken) {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (refreshError || !refreshData.session) {
        context.cookies.delete('sb-access-token', { path: '/' });
        context.cookies.delete('sb-refresh-token', { path: '/' });
        return context.redirect('/login');
      }

      // Set new tokens with extended duration
      context.cookies.set('sb-access-token', refreshData.session.access_token, {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      });
      context.cookies.set('sb-refresh-token', refreshData.session.refresh_token, {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      context.locals.user = refreshData.session.user;
    } else {
      context.cookies.delete('sb-access-token', { path: '/' });
      return context.redirect('/login');
    }
  } else {
    context.locals.user = user;

    // Proactively extend cookie TTL on every successful request
    // This keeps the session alive as long as the user is active
    context.cookies.set('sb-access-token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    });
    if (refreshToken) {
      context.cookies.set('sb-refresh-token', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  // Fetch profile with role using service role key
  const serverClient = createServerClient();

  // Check real admin profile first (needed for impersonation check)
  const { data: realProfile } = await serverClient
    .from('profiles')
    .select('*')
    .eq('id', context.locals.user!.id)
    .single();

  // Admin impersonation: if admin is impersonating another user, load that user's profile
  const impersonateAs = context.cookies.get('sb-impersonate-as')?.value;
  const impersonatingFrom = context.cookies.get('sb-impersonating-from')?.value;

  if (impersonateAs && impersonatingFrom && realProfile?.role === 'admin') {
    const { data: impersonatedProfile } = await serverClient
      .from('profiles')
      .select('*')
      .eq('id', impersonateAs)
      .single();

    if (impersonatedProfile) {
      context.locals.profile = impersonatedProfile;
      context.locals.impersonating = true;
      context.locals.realAdminId = realProfile.id;
    } else {
      // Invalid impersonation target — clear cookies and use real profile
      context.cookies.delete('sb-impersonate-as', { path: '/' });
      context.cookies.delete('sb-impersonating-from', { path: '/' });
      context.locals.profile = realProfile;
    }
  } else {
    if (realProfile) {
      context.locals.profile = realProfile;
    }
  }

  const profile = context.locals.profile;
  // For admin route access, check the REAL user (not impersonated)
  const isRealAdmin = realProfile?.role === 'admin';

  // Block admin routes for non-admins (use real identity, not impersonated)
  if (pathname.startsWith('/admin') && !isRealAdmin) {
    return context.redirect('/dashboard');
  }

  // Admin-only API routes
  const isAdminOnlyApi = pathname.startsWith('/api/admin');
  if (isAdminOnlyApi && !isRealAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  return next();
});
