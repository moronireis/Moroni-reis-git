import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';
import { createPostSchema, parseBody } from '../../../lib/validations';

export const GET: APIRoute = async ({ url }) => {
  const supabase = createServerClient();
  const spaceId = url.searchParams.get('space_id');

  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(id, full_name, role)
    `)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (spaceId) {
    query = query.eq('space_id', spaceId);
  }

  const { data, error } = await query;
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const supabase = createServerClient();
  const profile = locals.profile;

  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let rawBody: unknown;
  try { rawBody = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const parsed = parseBody(createPostSchema, rawBody);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400 });
  }

  const { space_id, title, content } = parsed.data;

  const { data, error } = await supabase
    .from('posts')
    .insert({
      space_id,
      author_id: profile.id,
      title: title || null,
      content,
    })
    .select(`
      *,
      author:profiles!posts_author_id_fkey(id, full_name, role)
    `)
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 201 });
};
