import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

// Webhook: receives survey responses from external forms (pesquisa-mdv, etc.)
// POST /api/webhook/survey
// Header: x-webhook-key
// Body: { source, title, summary, content, tags, metadata }

export const POST: APIRoute = async ({ request }) => {
  const authKey = request.headers.get('x-webhook-key');
  if (!authKey || authKey !== import.meta.env.WEBHOOK_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const { source, title, summary, content, tags, metadata } = body;

  if (!title || !content) {
    return new Response(JSON.stringify({ error: 'title and content required' }), { status: 400 });
  }

  const supabase = createServerClient();

  // Save to hub_knowledge
  const { data, error } = await supabase.from('hub_knowledge').insert({
    category: 'survey_response',
    title,
    summary: summary || null,
    content,
    source: source || 'survey',
    tags: tags || [],
    metadata: metadata || {},
    status: 'active',
  }).select('id').single();

  if (error) {
    console.error('Survey webhook - DB error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save' }), { status: 500 });
  }

  // Notify admins
  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin');

  if (admins && admins.length > 0) {
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type: 'system',
      title: title,
      body: summary || content.substring(0, 200),
      link: '/admin/knowledge',
      read: false,
    }));

    await supabase.from('notifications').insert(notifications);
  }

  return new Response(JSON.stringify({ ok: true, id: data?.id }), { status: 201 });
};
