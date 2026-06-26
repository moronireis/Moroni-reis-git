import type { APIRoute } from 'astro';
import { requireAuth } from '../../../../lib/api-auth';
import { createServerClient } from '../../../../lib/supabase-server';

export const prerender = false;

// GET /api/campaigns/[id]/preview
// Counts how many contacts will be reached by the campaign's segment_filter
export const GET: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id obrigatório' }, 400);

  const sb = createServerClient();

  const { data: campaign, error: campErr } = await sb
    .from('az_campaigns')
    .select('segment_filter')
    .eq('id', id)
    .single();

  if (campErr || !campaign) return json({ error: 'Campanha não encontrada' }, 404);

  const filter = (campaign.segment_filter || {}) as {
    brand_ids?: string[];
    cidade?: string;
    estado?: string;
    segmento?: string;
    status?: string;
  };

  const { contacts, error } = await resolveContacts(sb, filter, 5);
  if (error) return json({ error }, 500);

  return json({
    count: contacts.total,
    sample: contacts.sample,
  });
};

async function resolveContacts(
  sb: ReturnType<typeof import('../../../../lib/supabase-server').createServerClient>,
  filter: { brand_ids?: string[]; cidade?: string; estado?: string; segmento?: string; status?: string },
  sampleLimit = 5
) {
  const { brand_ids, cidade, estado, segmento, status } = filter;

  try {
    // If brand_ids filter: join through az_contact_brands
    if (brand_ids && brand_ids.length > 0) {
      // Get contact_ids that match brand filter
      const { data: cb, error: cbErr } = await sb
        .from('az_contact_brands')
        .select('contact_id')
        .in('brand_id', brand_ids);

      if (cbErr) return { contacts: { total: 0, sample: [] }, error: cbErr.message };

      const contactIds = [...new Set((cb || []).map((r: any) => r.contact_id))];
      if (contactIds.length === 0) return { contacts: { total: 0, sample: [] }, error: null };

      // Count
      let countQ = sb
        .from('az_contacts')
        .select('id', { count: 'exact', head: true })
        .in('id', contactIds)
        .not('phone_primary', 'is', null);

      if (cidade)   countQ = countQ.ilike('cidade', `%${cidade}%`);
      if (estado)   countQ = countQ.ilike('estado', `%${estado}%`);
      if (segmento) countQ = countQ.ilike('segmento', `%${segmento}%`);
      if (status)   countQ = countQ.eq('status', status);

      const { count } = await countQ;

      // Sample
      let sampleQ = sb
        .from('az_contacts')
        .select('nome_fantasia, razao_social, phone_primary, cidade')
        .in('id', contactIds)
        .not('phone_primary', 'is', null)
        .limit(sampleLimit);

      if (cidade)   sampleQ = sampleQ.ilike('cidade', `%${cidade}%`);
      if (estado)   sampleQ = sampleQ.ilike('estado', `%${estado}%`);
      if (segmento) sampleQ = sampleQ.ilike('segmento', `%${segmento}%`);
      if (status)   sampleQ = sampleQ.eq('status', status);

      const { data: sample } = await sampleQ;

      return {
        contacts: {
          total: count || 0,
          sample: (sample || []).map((c: any) => ({
            name: c.nome_fantasia || c.razao_social || '—',
            phone: c.phone_primary,
            cidade: c.cidade,
          })),
        },
        error: null,
      };
    }

    // No brand filter: query all contacts with phone
    let countQ = sb
      .from('az_contacts')
      .select('id', { count: 'exact', head: true })
      .not('phone_primary', 'is', null);

    if (cidade)   countQ = countQ.ilike('cidade', `%${cidade}%`);
    if (estado)   countQ = countQ.ilike('estado', `%${estado}%`);
    if (segmento) countQ = countQ.ilike('segmento', `%${segmento}%`);
    if (status)   countQ = countQ.eq('status', status);

    const { count } = await countQ;

    let sampleQ = sb
      .from('az_contacts')
      .select('nome_fantasia, razao_social, phone_primary, cidade')
      .not('phone_primary', 'is', null)
      .limit(sampleLimit);

    if (cidade)   sampleQ = sampleQ.ilike('cidade', `%${cidade}%`);
    if (estado)   sampleQ = sampleQ.ilike('estado', `%${estado}%`);
    if (segmento) sampleQ = sampleQ.ilike('segmento', `%${segmento}%`);
    if (status)   sampleQ = sampleQ.eq('status', status);

    const { data: sample } = await sampleQ;

    return {
      contacts: {
        total: count || 0,
        sample: (sample || []).map((c: any) => ({
          name: c.nome_fantasia || c.razao_social || '—',
          phone: c.phone_primary,
          cidade: c.cidade,
        })),
      },
      error: null,
    };
  } catch (e: any) {
    return { contacts: { total: 0, sample: [] }, error: e.message };
  }
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
