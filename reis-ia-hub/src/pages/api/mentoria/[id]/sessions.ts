import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase-server';
import { createSessionSchema, parseBody } from '../../../../lib/validations';

export const prerender = false;

async function checkAccess(supabase: ReturnType<typeof createServerClient>, mentorshipId: string, profileId: string, isAdmin: boolean) {
  if (isAdmin) return true;
  const { data } = await supabase
    .from('mentorships')
    .select('id')
    .eq('id', mentorshipId)
    .or(`mentor_id.eq.${profileId},mentee_id.eq.${profileId}`)
    .single();
  return !!data;
}

export const GET: APIRoute = async ({ params, locals }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  const hasAccess = await checkAccess(supabase, id, profile.id, isAdmin);
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const { data, error } = await supabase
    .from('mentorship_sessions')
    .select('*')
    .eq('mentorship_id', id)
    .order('date', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  const hasAccess = await checkAccess(supabase, id, profile.id, isAdmin);
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  let rawBody: unknown;
  try { rawBody = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const parsed = parseBody(createSessionSchema, rawBody);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400 });
  }

  const { date, duration_minutes, summary, notes, action_items, status } = parsed.data;

  const { data, error } = await supabase
    .from('mentorship_sessions')
    .insert({
      mentorship_id: id,
      date,
      duration_minutes: duration_minutes || 60,
      summary: summary || null,
      notes: notes || null,
      action_items: action_items || null,
      status: status || 'scheduled',
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
};
