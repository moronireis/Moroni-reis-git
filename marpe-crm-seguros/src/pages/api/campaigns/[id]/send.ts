import type { APIRoute } from 'astro';
import { requireAuth } from '../../../../lib/api-auth';
import { createServerClient } from '../../../../lib/supabase-server';
import { sendWhatsAppText } from '../../../../lib/whatsapp/send';

export const prerender = false;

// POST /api/campaigns/[id]/send — dispatch campaign to all matching contacts
export const POST: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });

  const sb = createServerClient();

  // Load campaign + template
  const { data: campaign, error: campErr } = await sb
    .from('marpe_campaigns')
    .select('*, marpe_templates(id, name, body)')
    .eq('id', id)
    .single();

  if (campErr || !campaign) {
    return new Response(JSON.stringify({ error: 'Campaign not found' }), { status: 404 });
  }
  if (campaign.status === 'sending' || campaign.status === 'sent') {
    return new Response(JSON.stringify({ error: 'Campaign already sent or in progress' }), { status: 409 });
  }
  if (!campaign.marpe_templates?.body) {
    return new Response(JSON.stringify({ error: 'Campaign has no template' }), { status: 400 });
  }

  // Build contact query from segment_filter
  const filter = campaign.segment_filter || {};
  let query = sb.from('marpe_contacts').select('id, name, phone').not('phone', 'is', null);

  if (filter.tags?.length) {
    query = query.overlaps('tags', filter.tags);
  }
  if (filter.city) {
    query = query.ilike('city', `%${filter.city}%`);
  }

  const { data: contacts, error: contactErr } = await query.limit(500);
  if (contactErr) return new Response(JSON.stringify({ error: contactErr.message }), { status: 500 });

  if (!contacts?.length) {
    return new Response(JSON.stringify({ error: 'No contacts match the filter' }), { status: 400 });
  }

  // Mark campaign as sending
  await sb.from('marpe_campaigns').update({
    status: 'sending',
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  // Send to all contacts (fire and forget — return immediately)
  let sent = 0;
  let failed = 0;

  (async () => {
    for (const contact of contacts) {
      if (!contact.phone) continue;

      let message: string = campaign.marpe_templates.body;
      message = message.replace(/\{\{nome\}\}/gi, contact.name || '');

      const result = await sendWhatsAppText(contact.phone, message, contact.id);

      await sb.from('marpe_campaign_recipients').insert({
        campaign_id: id,
        contact_id: contact.id,
        status: result.ok ? 'sent' : 'failed',
        sent_at: result.ok ? new Date().toISOString() : null,
        error_message: result.error || null,
      });

      if (result.ok) sent++; else failed++;

      // Rate limiting: ~1 msg/sec to avoid bans
      await new Promise(r => setTimeout(r, 1000));
    }

    await sb.from('marpe_campaigns').update({
      status: 'sent',
      sent_count: sent,
      failed_count: failed,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
  })();

  return new Response(JSON.stringify({
    ok: true,
    message: `Disparando para ${contacts.length} contatos`,
    total: contacts.length,
  }), { status: 200 });
};
