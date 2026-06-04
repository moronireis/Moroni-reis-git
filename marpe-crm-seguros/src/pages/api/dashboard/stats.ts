import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  const sb = createServerClient();

  const [contactsRes, dealsRes, funnelsRes] = await Promise.all([
    sb.from('marpe_contacts').select('id', { count: 'exact', head: true }),
    sb.from('marpe_deals').select('id, ramo, premio, comissao_valor, deal_type, seguradora, funnel_id, stage_id'),
    sb.from('marpe_funnels').select('id, name, marpe_funnel_stages(id, name, color, sort_order)').eq('is_active', true).order('sort_order'),
  ]);

  const deals = dealsRes.data || [];
  const totalContacts = contactsRes.count || 0;
  const totalDeals = deals.length;

  // Sum premio and comissao
  let totalPremio = 0;
  let totalComissao = 0;
  const ramoBreakdown: Record<string, number> = {};
  const dealTypeBreakdown: Record<string, number> = {};

  for (const d of deals) {
    if (d.premio) totalPremio += Number(d.premio);
    if (d.comissao_valor) totalComissao += Number(d.comissao_valor);
    if (d.ramo) ramoBreakdown[d.ramo] = (ramoBreakdown[d.ramo] || 0) + 1;
    if (d.deal_type) dealTypeBreakdown[d.deal_type] = (dealTypeBreakdown[d.deal_type] || 0) + 1;
  }

  return new Response(JSON.stringify({
    totalContacts,
    totalDeals,
    totalPremio,
    totalComissao,
    ramoBreakdown,
    dealTypeBreakdown,
    funnels: funnelsRes.data,
  }), { status: 200 });
};
