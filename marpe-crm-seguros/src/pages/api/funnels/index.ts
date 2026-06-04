import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  const sb = createServerClient();
  const { data: funnels, error } = await sb
    .from('marpe_funnels')
    .select('*, marpe_funnel_stages(id, name, color, sort_order, is_terminal, terminal_type)')
    .eq('is_active', true)
    .order('sort_order');

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  // Sort stages within each funnel
  const sorted = funnels?.map(f => ({
    ...f,
    stages: (f.marpe_funnel_stages || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    marpe_funnel_stages: undefined,
  }));

  return new Response(JSON.stringify({ funnels: sorted }), { status: 200 });
};
