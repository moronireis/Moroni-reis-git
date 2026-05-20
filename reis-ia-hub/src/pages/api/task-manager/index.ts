import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';
import { requireAuth, requireAdmin } from '../../../lib/api-auth';

export const prerender = false;

/**
 * GET /api/task-manager
 * - Admin (Moroni): sees ALL tasks across all projects/clients
 * - Client: sees only tasks where assigned_to = their profile ID
 *   OR tasks they created
 */
export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  let query = supabase
    .from('task_manager')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    // Clients see tasks assigned to them OR created by them
    query = query.or(`assigned_to.eq.${profile.id},created_by.eq.${profile.id}`);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data || []), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * POST /api/task-manager
 * - Admin: can create any task
 * - Client: can only create tasks with owner_type = 'client'
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';
  const body = await request.json();

  // Clients can only create client tasks
  if (!isAdmin && body.owner_type === 'moroni') {
    return new Response(
      JSON.stringify({ error: 'Clientes não podem criar tarefas do tipo Moroni' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const insert: Record<string, unknown> = {
    title: body.title,
    description: body.description || null,
    status: body.status || 'unlinked',
    owner_type: body.owner_type || 'client',
    assigned_to: body.assigned_to || null,
    assigned_name: body.assigned_name || null,
    created_by: profile.id,
    scheduled_date: body.scheduled_date || null,
    scheduled_time: body.scheduled_time || null,
    duration_minutes: body.duration_minutes || null,
    position: body.position ?? 0,
    project_id: body.project_id || null,
    project_name: body.project_name || null,
  };

  const { data, error } = await supabase
    .from('task_manager')
    .insert(insert)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
