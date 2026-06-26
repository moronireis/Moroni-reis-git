import type { APIRoute } from 'astro';
import { requireAuth } from '../../../../lib/api-auth';
import { createServerClient } from '../../../../lib/supabase-server';
import { sendWhatsAppText } from '../../../../lib/whatsapp/send';
import { resolveVariables } from '../../../../lib/variables';

export const prerender = false;

const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// POST /api/campaigns/[id]/send
export const POST: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id obrigatório' }, 400);

  const sb = createServerClient();

  // 1. Fetch campaign — must be draft or error
  const { data: campaign, error: campErr } = await sb
    .from('az_campaigns')
    .select('id, name, status, template_id, custom_body, segment_filter, az_templates(id, name, body)')
    .eq('id', id)
    .single();

  if (campErr || !campaign) return json({ error: 'Campanha não encontrada' }, 404);

  if (campaign.status === 'sending') {
    return json({ error: 'Campanha já está sendo disparada' }, 409);
  }
  if (campaign.status === 'completed') {
    return json({ error: 'Campanha já foi concluída' }, 409);
  }

  // 2. Resolve message body
  const templateBody: string | null =
    (campaign as any).az_templates?.body || campaign.custom_body || null;

  if (!templateBody) {
    return json({ error: 'Campanha sem mensagem — defina um template ou mensagem personalizada' }, 400);
  }

  // 3. Resolve contacts from segment_filter
  const filter = (campaign.segment_filter || {}) as {
    brand_ids?: string[];
    cidade?: string;
    estado?: string;
    segmento?: string;
    status?: string;
  };

  const { contacts, error: resolveErr } = await resolveAllContacts(sb, filter);
  if (resolveErr) return json({ error: resolveErr }, 500);
  if (!contacts.length) {
    return json({ error: 'Nenhum contato corresponde ao segmento selecionado' }, 400);
  }

  const total = contacts.length;

  // 4. Mark campaign as sending
  await sb.from('az_campaigns').update({
    status: 'sending',
    total_count: total,
    started_at: new Date().toISOString(),
  }).eq('id', id);

  // 5. Insert all recipients as pending
  const recipientRows = contacts.map((c: any) => ({
    campaign_id: id,
    contact_id: c.id,
    status: 'pending',
  }));

  await sb.from('az_campaign_recipients').insert(recipientRows);

  // 6. Fire and forget — return 200 immediately, process in background
  Promise.resolve().then(async () => {
    let sent = 0;
    let failed = 0;

    for (const contact of contacts) {
      // Resolve recipient row id for status update
      const { data: recipRow } = await sb
        .from('az_campaign_recipients')
        .select('id')
        .eq('campaign_id', id)
        .eq('contact_id', contact.id)
        .single();

      const recipId = recipRow?.id;

      try {
        const body = resolveVariables(templateBody, {
          nome_fantasia: contact.nome_fantasia,
          razao_social: contact.razao_social,
          cidade: contact.cidade,
          estado: contact.estado,
          contato: contact.contato,
          segmento: contact.segmento,
        });

        const result = await sendWhatsAppText(contact.phone_primary, body, contact.id, id);

        if (recipId) {
          await sb.from('az_campaign_recipients').update({
            status: result.ok ? 'sent' : 'failed',
            sent_at: result.ok ? new Date().toISOString() : null,
            error_message: result.error || null,
          }).eq('id', recipId);
        }

        if (result.ok) {
          sent++;
          await sb.from('az_campaigns').update({ sent_count: sent }).eq('id', id);
        } else {
          failed++;
          await sb.from('az_campaigns').update({ failed_count: failed }).eq('id', id);
        }
      } catch (e: any) {
        failed++;
        if (recipId) {
          await sb.from('az_campaign_recipients').update({
            status: 'failed',
            error_message: e.message || 'Erro desconhecido',
          }).eq('id', recipId);
        }
        await sb.from('az_campaigns').update({ failed_count: failed }).eq('id', id);
      }

      await sleep(DELAY_MS);
    }

    // 7. Mark campaign completed
    await sb.from('az_campaigns').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      sent_count: sent,
      failed_count: failed,
    }).eq('id', id);
  }).catch(async () => {
    // Top-level failure: mark as error
    await sb.from('az_campaigns').update({ status: 'error' }).eq('id', id);
  });

  // Return immediately — do not block
  return json({ ok: true, total, campaignId: id });
};

// Resolves all contacts matching the segment_filter
async function resolveAllContacts(
  sb: ReturnType<typeof import('../../../../lib/supabase-server').createServerClient>,
  filter: { brand_ids?: string[]; cidade?: string; estado?: string; segmento?: string; status?: string }
): Promise<{ contacts: any[]; error: string | null }> {
  const { brand_ids, cidade, estado, segmento, status } = filter;

  try {
    let contactIds: string[] | null = null;

    if (brand_ids && brand_ids.length > 0) {
      const { data: cb, error: cbErr } = await sb
        .from('az_contact_brands')
        .select('contact_id')
        .in('brand_id', brand_ids);

      if (cbErr) return { contacts: [], error: cbErr.message };

      contactIds = [...new Set((cb || []).map((r: any) => r.contact_id as string))];
      if (contactIds.length === 0) return { contacts: [], error: null };
    }

    let query = sb
      .from('az_contacts')
      .select('id, nome_fantasia, razao_social, phone_primary, cidade, estado, contato, segmento')
      .not('phone_primary', 'is', null);

    if (contactIds) query = query.in('id', contactIds);
    if (cidade)     query = query.ilike('cidade', `%${cidade}%`);
    if (estado)     query = query.ilike('estado', `%${estado}%`);
    if (segmento)   query = query.ilike('segmento', `%${segmento}%`);
    if (status)     query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return { contacts: [], error: error.message };

    return { contacts: data || [], error: null };
  } catch (e: any) {
    return { contacts: [], error: e.message };
  }
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
