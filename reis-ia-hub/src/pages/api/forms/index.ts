import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';
import { createBrandingFormSchema, parseBody } from '../../../lib/validations';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  let query = supabase
    .from('branding_forms')
    .select('*')
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    query = query.eq('user_id', profile.id);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const supabase = createServerClient();

  let rawBody: unknown;
  try { rawBody = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const parsed = parseBody(createBrandingFormSchema, rawBody);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400 });
  }

  const { form_type, mentorship_id, data: formData } = parsed.data;

  const { data, error } = await supabase
    .from('branding_forms')
    .insert({
      user_id: profile.id,
      mentorship_id: mentorship_id || null,
      form_type,
      data: formData || {},
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
};
