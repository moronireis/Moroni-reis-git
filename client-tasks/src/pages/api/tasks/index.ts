import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const prerender = false;

const CLIENT_ID = import.meta.env.CLIENT_ID;

export const GET: APIRoute = async () => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('task_manager')
    .select('*')
    .eq('client_id', CLIENT_ID)
    .order('position', { ascending: true })
    .order('created_at', { ascending: false });

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

export const POST: APIRoute = async ({ request }) => {
  const supabase = createServerClient();
  const body = await request.json();

  const insert: Record<string, unknown> = {
    title: body.title,
    description: body.description || null,
    status: body.status || 'unlinked',
    owner_type: body.owner_type || 'client',
    assigned_to: body.assigned_to || null,
    assigned_name: body.assigned_name || null,
    created_by: null,
    scheduled_date: body.scheduled_date || null,
    scheduled_time: body.scheduled_time || null,
    duration_minutes: body.duration_minutes || null,
    position: body.position ?? 0,
    project_id: body.project_id || null,
    project_name: body.project_name || null,
    client_id: CLIENT_ID,
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
