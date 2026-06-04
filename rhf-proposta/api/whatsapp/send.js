/**
 * WhatsApp Send — Vercel Serverless Function
 *
 * POST /api/whatsapp/send
 * Body: { phone, text }
 *
 * Sends via ChatGuru API (safe, official) — NOT Evolution.
 * Also stores the outbound message in Supabase rhf_messages.
 */

const SUPABASE_URL = 'https://weirdpigeon-supabase.cloudfy.live';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM3Njg1MTYsImV4cCI6MTgwNTMwNDUxNn0.Hziwx8ocWnFVLHvt5DhT8nTkL2XVMa58ofjL-0hCMxw';

const CHATGURU_ENDPOINT = 'https://s18.chatguru.app/api/v1';
const CHATGURU_KEY = '2TY3YN1OX7SNIY8WVR55P5L031ZZEPJ2W96JMTU49JSAIIZ7OD5Q0PM9CFEIANCZ';
const CHATGURU_ACCOUNT_ID = '68c48705e7137cfac12a9c14';
const CHATGURU_PHONE_ID = '68c865688c9ccc7f6289611e';

async function chatguruSend(phone, text) {
  const body = new URLSearchParams({
    key: CHATGURU_KEY,
    account_id: CHATGURU_ACCOUNT_ID,
    phone_id: CHATGURU_PHONE_ID,
    action: 'message_send',
    chat_number: phone,
    text,
  });

  const res = await fetch(CHATGURU_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  return res.json();
}

async function supabaseInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { phone, text } = req.body;

    if (!phone || !text) {
      return res.status(400).json({ status: 'error', message: 'phone and text are required' });
    }

    // Send via ChatGuru
    const chatguruResult = await chatguruSend(phone, text);

    // Store outbound message in Supabase
    await supabaseInsert('rhf_messages', {
      phone,
      direction: 'outbound',
      content: text,
      message_type: 'chat',
      chatguru_message_id: chatguruResult.message_id || null,
    });

    // Log the action
    await supabaseInsert('sync_log', {
      source: 'whatsapp-chat',
      action: 'message_sent',
      entity_type: 'message',
      entity_id: chatguruResult.message_id || phone,
      status: chatguruResult.result === 'success' ? 'success' : 'error',
      payload: { phone, text: text.substring(0, 100), chatguru_response: chatguruResult },
    });

    return res.status(200).json({
      status: 'ok',
      chatguru: chatguruResult,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
