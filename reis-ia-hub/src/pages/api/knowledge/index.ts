import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';
import { requireAuth, requireAdmin } from '../../../lib/api-auth';
import { notifyAdmins } from '../../../lib/notifications';

export const GET: APIRoute = async ({ url, locals }) => {
  const auth = requireAdmin(locals);
  if (auth instanceof Response) return auth;

  const supabase = createServerClient();
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);

  let query = supabase
    .from('hub_knowledge')
    .select('*, user:profiles!hub_knowledge_user_id_fkey(id, full_name, email)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (category) query = query.eq('category', category);
  if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  const supabase = createServerClient();
  const body = await request.json();

  const insert = {
    user_id: (profile as any).id,
    user_name: (profile as any).full_name || body.user_name || null,
    user_email: body.user_email || null,
    category: body.category || 'general',
    title: body.title,
    summary: body.summary || null,
    content: body.content,
    source: body.source || null,
    tags: body.tags || [],
    metadata: body.metadata || {},
    journey_id: body.journey_id || null,
    project_id: body.project_id || null,
    status: 'active',
  };

  if (!insert.title || !insert.content) {
    return new Response(JSON.stringify({ error: 'title and content required' }), { status: 400 });
  }

  const { data, error } = await supabase.from('hub_knowledge').insert(insert).select().single();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  // Notify admin about new knowledge entry
  const categoryLabels: Record<string, string> = {
    form_response: 'Formulário',
    checkpoint_feedback: 'Checkpoint',
    survey_response: 'Pesquisa',
    research: 'Pesquisa',
    meeting_notes: 'Reunião',
    client_data: 'Cliente',
    agent_output: 'Agente',
    general: 'Geral',
  };

  notifyAdmins({
    type: 'system',
    title: `${categoryLabels[insert.category] || 'Dados'}: ${insert.title}`,
    body: insert.summary || insert.content.substring(0, 200),
    link: '/admin/knowledge',
  });

  return new Response(JSON.stringify(data), { status: 201 });
};
