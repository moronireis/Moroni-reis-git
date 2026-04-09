import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase-server';
import { notify } from '../../../../lib/notifications';
import { createCommentSchema, parseBody } from '../../../../lib/validations';

export const GET: APIRoute = async ({ params }) => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!comments_author_id_fkey(id, full_name, role)
    `)
    .eq('post_id', params.id)
    .order('created_at', { ascending: true });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  const supabase = createServerClient();
  const profile = locals.profile;

  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let rawBody: unknown;
  try { rawBody = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const parsed = parseBody(createCommentSchema, rawBody);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400 });
  }

  const { content, parent_id } = parsed.data;

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: params.id,
      author_id: profile.id,
      content,
      parent_id: parent_id || null,
    })
    .select(`
      *,
      author:profiles!comments_author_id_fkey(id, full_name, role)
    `)
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  // Increment comments_count and get post author
  const { data: post } = await supabase
    .from('posts')
    .select('comments_count, author_id')
    .eq('id', params.id)
    .single();

  if (post) {
    await supabase
      .from('posts')
      .update({ comments_count: (post.comments_count ?? 0) + 1 })
      .eq('id', params.id);

    // Notify post author (if not self-commenting)
    if (post.author_id && post.author_id !== profile.id) {
      notify({
        userId: post.author_id,
        type: 'comment',
        title: 'Novo comentario',
        body: `${profile.full_name || 'Alguem'} comentou no seu post`,
        link: '/community',
      });
    }
  }

  return new Response(JSON.stringify(data), { status: 201 });
};
