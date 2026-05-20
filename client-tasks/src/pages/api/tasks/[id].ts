import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const prerender = false;

const CLIENT_ID = import.meta.env.CLIENT_ID;

export const PATCH: APIRoute = async ({ params, request }) => {
  const supabase = createServerClient();
  const body = await request.json();

  // Verify task belongs to this client
  const { data: existing } = await supabase
    .from('task_manager')
    .select('client_id')
    .eq('id', params.id)
    .single();

  if (!existing) {
    return new Response(JSON.stringify({ error: 'Tarefa não encontrada' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (existing.client_id !== CLIENT_ID) {
    return new Response(JSON.stringify({ error: 'Sem permissão' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
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

export const DELETE: APIRoute = async ({ params }) => {
  const supabase = createServerClient();

  // Verify task belongs to this client
  const { data: existing } = await supabase
    .from('task_manager')
    .select('client_id')
    .eq('id', params.id)
    .single();

  if (!existing || existing.client_id !== CLIENT_ID) {
    return new Response(JSON.stringify({ error: 'Sem permissão' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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
