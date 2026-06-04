/**
 * Meta WhatsApp Cloud API Webhook — Vercel Serverless Function
 */

const VERIFY_TOKEN = 'rhf-talentos-webhook-2026';
const META_ACCESS_TOKEN = 'EAAeskwPUZBwIBRkyJpM84nosxJ6EIXBauDBh1g8L9Nwmkm8qeIG8lyDBWK1kPfBPRgT9XkjaVewIthr8EperiSSjlKJXRMtGwjRmmOxvcpEauINiMDnbUqhkB0eUfJ6PgIdkY2uHFrCfH6ZCQGX8IkIAHd5kZALJv8vg63Rt0ProQ3IsRuIvVRP7oGEBTyx51G0osCuZAc77NDN0OSGVBuufGsRqUcsKwmqwm0CZCNrpZCGYwK42hZC1gmolic79CdnpYeS8jMZAATrEHozL9d9K';
const SUPABASE_URL = 'https://weirdpigeon-supabase.cloudfy.live';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM3Njg1MTYsImV4cCI6MTgwNTMwNDUxNn0.Hziwx8ocWnFVLHvt5DhT8nTkL2XVMa58ofjL-0hCMxw';

module.exports = async function handler(req, res) {
  // GET: Webhook Verification
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Verification failed' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;
  const results = [];

  try {
    if (!body || body.object !== 'whatsapp_business_account') {
      return res.status(200).json({ status: 'ok', ignored: true });
    }

    const entries = body.entry || [];

    for (let i = 0; i < entries.length; i++) {
      const changes = entries[i].changes || [];

      for (let j = 0; j < changes.length; j++) {
        const value = changes[j].value || {};
        const field = changes[j].field;

        if (field === 'messages' && value.messages) {
          const contacts = value.contacts || [];
          const contactMap = {};
          for (let k = 0; k < contacts.length; k++) {
            contactMap[contacts[k].wa_id] = (contacts[k].profile && contacts[k].profile.name) || contacts[k].wa_id;
          }

          for (let m = 0; m < value.messages.length; m++) {
            const msg = value.messages[m];
            const phone = msg.from;
            const contactName = contactMap[phone] || phone;

            // Extract text
            var text = '';
            var msgType = 'chat';
            if (msg.text && msg.text.body) { text = msg.text.body; msgType = 'chat'; }
            else if (msg.image) { text = msg.image.caption || '[Imagem]'; msgType = 'image'; }
            else if (msg.audio) { text = '[Audio]'; msgType = 'ptt'; }
            else if (msg.video) { text = msg.video.caption || '[Video]'; msgType = 'file'; }
            else if (msg.document) { text = (msg.document.filename) || '[Documento]'; msgType = 'file'; }
            else if (msg.sticker) { text = '[Sticker]'; msgType = 'image'; }
            else if (msg.reaction) { text = '[Reação]'; msgType = 'chat'; }
            else { text = '[' + (msg.type || 'mensagem') + ']'; msgType = 'chat'; }

            // Detect ChatGuru signed messages (outbound sent by team via ChatGuru)
            // ChatGuru adds "*AgentName:*\n" prefix when signMsg is enabled
            var direction = 'inbound';
            var signMatch = text.match(/^\*([^*]+):\*\s*/);
            if (signMatch) {
              direction = 'outbound';
              text = text.replace(/^\*[^*]+:\*\s*/, '').trim();
            }

            // Insert message
            var insertRes = await fetch(SUPABASE_URL + '/rest/v1/rhf_messages', {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({
                phone: phone,
                direction: direction,
                content: text,
                message_type: msgType,
                chatguru_message_id: msg.id || null,
                chatguru_chat_id: phone,
                raw_webhook: { source: 'meta_cloud_api', contact_name: contactName, wamid: msg.id, type: msg.type }
              })
            });

            var insertBody = await insertRes.text();
            results.push({ phone: phone, status: insertRes.status, body: insertBody.substring(0, 100) });
          }
        }
      }
    }
  } catch (err) {
    results.push({ error: err.message });
  }

  return res.status(200).json({ status: 'ok', results: results });
};
