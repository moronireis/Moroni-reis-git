import type { APIRoute } from 'astro';
import { createServerSupabase } from '../../../lib/supabase-server';

const ALLOWED_FIELDS = [
  'name', 'email', 'lead_stage', 'event_type', 'event_date',
  'guest_count', 'budget_range', 'notes', 'source',
];

export const PATCH: APIRoute = async ({ request, params }) => {
  const { id } = params;
  if (!id) return new Response('Missing id', { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Only allow known CRM fields
  const update: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) update[key] = body[key];
  }

  if (Object.keys(update).length === 0) {
    return new Response('No fields to update', { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('castelo_contacts')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
