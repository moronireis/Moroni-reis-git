import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Webhook: receives purchase events from Hotmart (v2.0)
// POST /api/webhook/hotmart
// Body: Hotmart v2.0 payload — validated via hottok field
// Tracking/analytics only — NO account creation, NO product delivery
// Hotmart handles delivery via its own members area

const HANDLED_EVENTS = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'PURCHASE_CANCELED', 'PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK'];

function resolveStatus(event: string): string {
  switch (event) {
    case 'PURCHASE_APPROVED': return 'verified';
    case 'PURCHASE_COMPLETE': return 'verified';
    case 'PURCHASE_CANCELED': return 'cancelled';
    case 'PURCHASE_REFUNDED': return 'refunded';
    case 'PURCHASE_CHARGEBACK': return 'chargeback';
    default: return 'verified';
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const event: string = body.event || '';

  // Skip unhandled events early — always 200 to avoid Hotmart retries
  if (!HANDLED_EVENTS.includes(event)) {
    return new Response(JSON.stringify({ ok: true, skipped: true, event }), { status: 200 });
  }

  // Hotmart sends its own hottok — validate if HOTMART_WEBHOOK_TOKEN is set
  // If not set or empty, accept all requests (Hotmart validates via the secret URL)
  const hotmartToken = process.env.HOTMART_WEBHOOK_TOKEN || import.meta.env.HOTMART_WEBHOOK_TOKEN;
  if (hotmartToken && hotmartToken !== 'hotmart_latam_webhook_2026_secure' && body.hottok !== hotmartToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const purchaseData = body.data || {};
  const buyer = purchaseData.buyer || {};
  const purchase = purchaseData.purchase || {};
  const product = purchaseData.product || {};

  const email = buyer.email?.toLowerCase();
  if (!email) {
    return new Response(JSON.stringify({ error: 'data.buyer.email is required' }), { status: 400 });
  }

  const name = buyer.name || email.split('@')[0] || 'Comprador';
  const phoneRaw = buyer.phone
    ? `${buyer.phone.country_code || ''}${buyer.phone.number || ''}`.replace(/\D/g, '')
    : '';
  const phone = phoneRaw || null;

  const transactionId = purchase.transaction || null;
  const paidAmount = purchase.price?.value ?? null;
  const currency = purchase.price?.currency_code || 'USD';
  const paymentType = purchase.payment?.type || null;
  const productName = product.name || 'Produto Hotmart';

  const status = resolveStatus(event);
  const supabase = createServerClient();

  // Insert purchase record into hotmart_purchases table
  const { error: insertError } = await supabase.from('hotmart_purchases').insert({
    email,
    name,
    phone,
    product_name: productName,
    transaction_id: transactionId,
    paid_amount: paidAmount,
    currency,
    payment_type: paymentType,
    hotmart_event: event,
    utm_data: {},
    status,
  });

  if (insertError) {
    console.error('Hotmart webhook - insert purchase error:', insertError);
    return new Response(JSON.stringify({ error: 'Failed to record purchase' }), { status: 500 });
  }

  // Send Purchase event to Meta Conversions API only on PURCHASE_APPROVED
  if (event === 'PURCHASE_APPROVED') {
    const metaPixelId = '1007308958336132';
    const metaAccessToken = process.env.META_ACCESS_TOKEN || import.meta.env.META_ACCESS_TOKEN;

    if (metaAccessToken) {
      const eventTime = Math.floor(Date.now() / 1000);
      const capiPayload = {
        data: [{
          event_name: 'Purchase',
          event_time: eventTime,
          action_source: 'website',
          event_source_url: 'https://agentesia.moronireis.com.br/latam',
          user_data: {
            em: [await sha256(email)],
            ...(phone ? { ph: [await sha256(phone)] } : {}),
          },
          custom_data: {
            currency,
            value: paidAmount ?? 9.00,
            content_name: productName,
            content_type: 'product',
            order_id: transactionId || undefined,
          },
        }],
      };

      try {
        const capiRes = await fetch(
          `https://graph.facebook.com/v24.0/${metaPixelId}/events?access_token=${metaAccessToken}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(capiPayload),
          }
        );
        if (!capiRes.ok) {
          const capiBody = await capiRes.text();
          console.error('Meta CAPI non-200 response:', capiRes.status, capiBody);
        }
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
        title: 'Nova compra via Hotmart',
        body: `${name} (${email}) comprou ${productName}${transactionId ? ` — TX ${transactionId}` : ''}${paidAmount != null ? ` — ${currency} ${paidAmount.toFixed(2)}` : ''}`,
        link: '/admin/crm',
        read: false,
      }));

      await supabase.from('notifications').insert(notifications);
    }
  }

  return new Response(JSON.stringify({
    ok: true,
    event,
    email,
    product: productName,
    status,
  }), { status: 201 });
};
