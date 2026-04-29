import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Webhook: receives purchase events from Ticto (v2.0)
// POST /api/webhook/ticto
// Body: Ticto v2.0 payload — validated via token field
// On status "authorized": records purchase in ticto_purchases table
// Account creation happens later via /obrigado page (user sets own password)

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  // Validate Ticto token (set TICTO_WEBHOOK_TOKEN in Vercel env vars)
  const tictoToken = process.env.TICTO_WEBHOOK_TOKEN || import.meta.env.TICTO_WEBHOOK_TOKEN;
  if (tictoToken && body.token !== tictoToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Only process approved purchases
  if (body.status !== 'authorized') {
    return new Response(JSON.stringify({ ok: true, skipped: true, status: body.status }), { status: 200 });
  }

  const email = body.customer?.email?.toLowerCase();
  const name = body.customer?.name || email?.split('@')[0] || 'Aluno';
  const phone = body.customer?.phone
    ? `${body.customer.phone.ddd || ''}${body.customer.phone.number || ''}`.replace(/\D/g, '')
    : '';
  const productName = body.item?.product_name || 'Produto Ticto';
  const orderId = body.order?.id?.toString() || '';
  const orderHash = body.order?.hash || '';
  const paidAmount = body.order?.paid_amount
    ? body.order.paid_amount / 100
    : (body.item?.price ? parseFloat(body.item.price) : null);

  // Extract UTM tracking data from Ticto payload
  const tracking = body.tracking || {};
  const utmData = {
    utm_source: tracking.utm_source || null,
    utm_medium: tracking.utm_medium || null,
    utm_campaign: tracking.utm_campaign || null,
    utm_content: tracking.utm_content || null,
    utm_term: tracking.utm_term || null,
    src: tracking.src || null,
    sck: tracking.sck || null,
    fbc: tracking.fbc || null,
    fbp: tracking.fbp || null,
  };

  if (!email) {
    return new Response(JSON.stringify({ error: 'customer.email is required' }), { status: 400 });
  }

  const supabase = createServerClient();

  // Insert purchase record into ticto_purchases table
  const { error: insertError } = await supabase.from('ticto_purchases').insert({
    email,
    name,
    phone: phone || null,
    product_name: productName,
    order_id: orderId || null,
    order_hash: orderHash || null,
    paid_amount: paidAmount,
    utm_data: utmData,
    status: 'verified',
  });

  if (insertError) {
    console.error('Ticto webhook - insert purchase error:', insertError);
    return new Response(JSON.stringify({ error: 'Failed to record purchase' }), { status: 500 });
  }

  // Send Purchase event to Meta Conversions API (server-side)
  const metaPixelId = '434040298956723';
  const metaAccessToken = process.env.META_ACCESS_TOKEN || import.meta.env.META_ACCESS_TOKEN;
  if (metaAccessToken) {
    const eventTime = Math.floor(Date.now() / 1000);
    const capiPayload = {
      data: [{
        event_name: 'Purchase',
        event_time: eventTime,
        action_source: 'website',
        event_source_url: 'https://agentesia.moronireis.com.br/',
        user_data: {
          em: [await sha256(email)],
          ...(phone ? { ph: [await sha256(phone)] } : {}),
          ...(tracking.fbc ? { fbc: tracking.fbc } : {}),
          ...(tracking.fbp ? { fbp: tracking.fbp } : {}),
        },
        custom_data: {
          currency: 'BRL',
          value: paidAmount || 47.00,
          content_name: productName,
          content_type: 'product',
          order_id: orderId,
        },
        ...(utmData.utm_source ? { event_source_url: `https://agentesia.moronireis.com.br/?utm_source=${utmData.utm_source}&utm_medium=${utmData.utm_medium || ''}&utm_campaign=${utmData.utm_campaign || ''}` } : {}),
      }],
    };

    try {
      await fetch(`https://graph.facebook.com/v24.0/${metaPixelId}/events?access_token=${metaAccessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload),
      });
    } catch (capiErr) {
      console.error('Meta CAPI error:', capiErr);
    }
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
      title: 'Nova compra via Ticto',
      body: `${name} (${email}) comprou ${productName}${orderId ? ` — Pedido #${orderId}` : ''}${paidAmount ? ` — R$${paidAmount.toFixed(2)}` : ''}${utmData.utm_source ? ` — via ${utmData.utm_source}/${utmData.utm_medium || '?'}` : ''}`,
      link: '/admin/crm',
      read: false,
    }));

    await supabase.from('notifications').insert(notifications);
  }

  return new Response(JSON.stringify({
    ok: true,
    email,
    product: productName,
  }), { status: 201 });
};
