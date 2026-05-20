// Mercado Pago Webhook — receives payment notifications
// Saves to Supabase + sends email via Resend + WhatsApp notification

const SUPABASE_URL = 'https://weirdpigeon-supabase.cloudfy.live';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM3Njg1MTYsImV4cCI6MTgwNTMwNDUxNn0.Hziwx8ocWnFVLHvt5DhT8nTkL2XVMa58ofjL-0hCMxw';
const RESEND_KEY = 're_MTugi3Pt_Pks8TtxzvaZWYiPxRSKmdfbs';
const MP_TOKEN = 'APP_USR-7183408974757322-050400-7bbab65db347ec3ac2a325b4e6b7731b-636233773';

export default async function handler(req, res) {
  // Handle GET (MP verification)
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    console.log('MP Webhook received:', JSON.stringify(body));

    // MP sends different types of notifications
    const type = body.type || body.topic;
    const dataId = body.data?.id || body.id;

    if (type === 'payment' && dataId) {
      // Fetch payment details from MP API
      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
        headers: { 'Authorization': `Bearer ${MP_TOKEN}` }
      });
      const payment = await paymentRes.json();

      if (payment.status === 'approved') {
        const amount = payment.transaction_amount;
        const payerEmail = payment.payer?.email || 'N/A';
        const payerName = payment.payer?.first_name || payment.payer?.email || 'Anônimo';
        const paymentMethod = payment.payment_method_id || 'N/A';
        const items = payment.additional_info?.items?.map(i => i.title).join(', ') || 'Presente';

        // 1. Save to Supabase
        await fetch(`${SUPABASE_URL}/rest/v1/wedding_gifts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({
            tipo: paymentMethod === 'pix' ? 'pix' : 'outro',
            valor: amount,
            descricao: `${payerName} — ${items} (${paymentMethod})`
          })
        });

        // 2. Notify via centralized endpoint (email + WhatsApp)
        await fetch('https://moroniedaphine.vercel.app/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'pagamento',
            nome: payerName,
            valor: amount.toFixed(2),
            detalhes: `${paymentMethod} — ${items} (ID: ${dataId})`
          })
        });

        console.log(`Payment approved: R$ ${amount} from ${payerName}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ received: true, error: error.message });
  }
}
