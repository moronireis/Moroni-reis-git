import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';
import { requireAuth } from '../../../lib/api-auth';

export const prerender = false;

/**
 * PATCH /api/task-manager/[id]
 * - Admin: can update any task
 * - Client: can only update tasks they created or are assigned to
 */
export const PATCH: APIRoute = async ({ params, request, locals }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';
  const body = await request.json();

  // If not admin, verify ownership
  if (!isAdmin) {
    const { data: existing } = await supabase
      .from('task_manager')
      .select('created_by, assigned_to')
      .eq('id', params.id)
      .single();

    if (!existing) {
      return new Response(JSON.stringify({ error: 'Tarefa não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (existing.created_by !== profile.id && existing.assigned_to !== profile.id) {
      return new Response(JSON.stringify({ error: 'Sem permissão' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Clients cannot change owner_type to moroni
    if (body.owner_type === 'moroni') {
      return new Response(
        JSON.stringify({ error: 'Sem permissão para alterar tipo' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  const allowedFields = [
    'title', 'description', 'status', 'owner_type',
    'assigned_to', 'assigned_name', 'scheduled_date',
    'scheduled_time', 'duration_minutes', 'position',
    'project_id', 'project_name',
  ];

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowedFields) {
    if (key in body) {
      patch[key] = body[key];
    }
  }

  const { data, error } = await supabase
    .from('task_manager')
    .update(patch)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * DELETE /api/task-manager/[id]
 * - Admin only
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  if (profile.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Apenas admin pode excluir' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from('task_manager')
    .delete()
    .eq('id', params.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(null, { status: 204 });
};
