import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase-server';
import { createMentorshipTaskSchema, parseBody } from '../../../../lib/validations';

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

export const GET: APIRoute = async ({ params, locals, url }) => {
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

  const roleParam = url.searchParams.get('role');

  let query = supabase
    .from('mentorship_tasks')
    .select('*')
    .eq('mentorship_id', id)
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    // Non-admins always see only mentee tasks regardless of role param
    query = query.eq('assigned_to', 'mentee');
  } else if (roleParam === 'mentor' || roleParam === 'mentee') {
    // Admin can filter by role param
    query = query.eq('assigned_to', roleParam);
  }
  // Admin with no role param: return all tasks

  const { data, error } = await query;

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

  // Only admins can create tasks
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const hasAccess = await checkAccess(supabase, id, profile.id, isAdmin);
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  let rawBody: unknown;
  try { rawBody = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const parsed = parseBody(createMentorshipTaskSchema, rawBody);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400 });
  }

  const { title, description, priority, due_date, category, assigned_to, link } = parsed.data;

  const { data, error } = await supabase
    .from('mentorship_tasks')
    .insert({
      mentorship_id: id,
      title,
      description: description || null,
      priority: priority || 'medium',
      status: 'pending',
      due_date: due_date || null,
      category: category || 'builders',
      assigned_to: assigned_to || 'mentee',
      link: link || null,
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
};

export const PATCH: APIRoute = async ({ params, request, locals }) => {
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

  const body = await request.json();
  const { task_id, status, title, description, priority, due_date, category, assigned_to, link } = body;

  if (!task_id) {
    return new Response(JSON.stringify({ error: 'task_id is required' }), { status: 400 });
  }

  const updatePayload: Record<string, unknown> = {};

  // Status toggle available to all with access
  if (status !== undefined) {
    updatePayload.status = status;
    if (status === 'done') {
      updatePayload.completed_at = new Date().toISOString();
    } else {
      updatePayload.completed_at = null;
    }
  }

  // Full edit only for admins
  if (isAdmin) {
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (priority !== undefined) updatePayload.priority = priority;
    if (due_date !== undefined) updatePayload.due_date = due_date;
    if (category !== undefined) updatePayload.category = category;
    if (assigned_to !== undefined) updatePayload.assigned_to = assigned_to;
    if (link !== undefined) updatePayload.link = link;
  }

  const { data, error } = await supabase
    .from('mentorship_tasks')
    .update(updatePayload)
    .eq('id', task_id)
    .eq('mentorship_id', id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};
