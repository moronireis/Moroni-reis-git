/**
 * ChatGuru Webhook Receiver — Vercel Serverless Function
 *
 * Receives webhook POSTs from ChatGuru and stores in Supabase.
 * URL: https://rhf-proposta.vercel.app/api/webhook/chatguru
 */

const SUPABASE_URL = 'https://weirdpigeon-supabase.cloudfy.live';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM3Njg1MTYsImV4cCI6MTgwNTMwNDUxNn0.Hziwx8ocWnFVLHvt5DhT8nTkL2XVMa58ofjL-0hCMxw';

async function supabaseInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function supabaseSelect(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    }
  });
  return res.json();
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'RHF Talentos Webhook',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    console.log('[Webhook] Received:', JSON.stringify(payload));

    // Extract fields from ChatGuru webhook
    const {
      nome,
      celular,
      texto_mensagem,
      tipo_mensagem = 'chat',
      phone_id,
      chat_id,
      chat_created,
      datetime_post,
      tags,
      campos_personalizados,
      responsavel_nome,
      responsavel_email,
      link_chat,
      email,
      origem,
      campanha_id,
      campanha_nome,
      url_arquivo
    } = payload;

    // Normalize phone number
    const phone = (celular || '').replace(/\D/g, '');

    if (!phone) {
      console.log('[Webhook] No phone number in payload, skipping');
      return res.status(200).json({ status: 'skipped', reason: 'no phone' });
    }

    // 1. Upsert candidate
    const existing = await supabaseSelect('candidates', `phone=eq.${phone}&select=id`);

    let candidateId;
    if (Array.isArray(existing) && existing.length > 0) {
      candidateId = existing[0].id;
    } else if (nome && phone) {
      const inserted = await supabaseInsert('candidates', {
        name: nome,
        phone: phone,
        email: email || null,
        chatguru_chat_id: chat_id || null,
        chatguru_phone_id: phone_id || null,
        status: 'new',
        raw_data: payload
      });
      candidateId = Array.isArray(inserted) && inserted[0] ? inserted[0].id : null;
    }

    // 2. Store message
    const messageData = {
      phone: phone,
      direction: 'inbound',
      content: texto_mensagem || url_arquivo || '[media]',
      message_type: tipo_mensagem || 'chat',
      chatguru_chat_id: chat_id || null,
      candidate_id: candidateId || null,
      raw_webhook: payload
    };

    await supabaseInsert('rhf_messages', messageData);

    // 3. Log sync event
    await supabaseInsert('sync_log', {
      source: 'chatguru',
      action: 'webhook_received',
      entity_type: 'message',
      entity_id: chat_id || phone,
      status: 'success',
      payload: { nome, phone, tipo_mensagem, texto_mensagem: (texto_mensagem || '').substring(0, 100) }
    });

    console.log(`[Webhook] Processed: ${nome} (${phone}) — ${tipo_mensagem}`);

    return res.status(200).json({
      status: 'ok',
      candidate_id: candidateId,
      message_stored: true
    });

  } catch (error) {
    console.error('[Webhook] Error:', error);

    // Log error but still return 200 to ChatGuru (avoid retries)
    try {
      await supabaseInsert('sync_log', {
        source: 'chatguru',
        action: 'webhook_error',
        entity_type: 'message',
        status: 'error',
        error_message: error.message || String(error),
        payload: req.body
      });
    } catch (_) { /* ignore logging errors */ }

    return res.status(200).json({ status: 'error', message: error.message });
  }
}
