import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

// GET /api/contacts/segmentos
// Segmentos e status reais existentes na base (com contagem) — as opções do
// wizard eram hardcoded e não batiam com os dados ("Serviço"/"Outros" não
// existem; "Festa" com 236 contatos ficava de fora).
export const GET: APIRoute = async ({ locals }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const sb = createServerClient();
  const counts = new Map<string, number>();
  const statusCounts: Record<string, number> = {};
  const vendedorCounts = new Map<string, number>();
  let semSegmento = 0;

  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from('az_contacts')
      .select('segmento, status, vendedor_principal')
      .not('phone_primary', 'is', null)
      .range(from, from + PAGE - 1);
    if (error) return json({ error: error.message }, 500);
    for (const r of data || []) {
      const st = (r.status || '').trim();
      if (st) statusCounts[st] = (statusCounts[st] || 0) + 1;
      const v = ((r as any).vendedor_principal || '').trim();
      if (v) vendedorCounts.set(v, (vendedorCounts.get(v) || 0) + 1);
      const s = (r.segmento || '').trim();
      if (!s) { semSegmento++; continue; }
      counts.set(s, (counts.get(s) || 0) + 1);
    }
    if (!data || data.length < PAGE) break;
  }

  const segmentos = [...counts.entries()]
    .map(([segmento, count]) => ({ segmento, count }))
    .sort((a, b) => b.count - a.count);

  const vendedores = [...vendedorCounts.entries()]
    .map(([vendedor, count]) => ({ vendedor, count }))
    .sort((a, b) => b.count - a.count);

  return json({ segmentos, sem_segmento: semSegmento, status_counts: statusCounts, vendedores });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
