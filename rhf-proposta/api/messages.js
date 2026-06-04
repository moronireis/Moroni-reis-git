/**
 * Messages API — Vercel Serverless Function
 *
 * GET /api/messages?phone=5511967615987 — fetch conversation history
 * GET /api/messages — fetch all recent messages
 * POST /api/messages — send a message via ChatGuru
 */

const SUPABASE_URL = 'https://weirdpigeon-supabase.cloudfy.live';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM3Njg1MTYsImV4cCI6MTgwNTMwNDUxNn0.Hziwx8ocWnFVLHvt5DhT8nTkL2XVMa58ofjL-0hCMxw';

const CHATGURU_ENDPOINT = 'https://s18.chatguru.app/api/v1';
const CHATGURU_KEY = '2TY3YN1OX7SNIY8WVR55P5L031ZZEPJ2W96JMTU49JSAIIZ7OD5Q0PM9CFEIANCZ';
const CHATGURU_ACCOUNT_ID = '68c48705e7137cfac12a9c14';
const CHATGURU_PHONE_ID = '68c865688c9ccc7f6289611e';

async function supabaseGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    }
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
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function chatguruSend(chatNumber, text) {
  const body = new URLSearchParams({
    key: CHATGURU_KEY,
    account_id: CHATGURU_ACCOUNT_ID,
    phone_id: CHATGURU_PHONE_ID,
    action: 'message_send',
    chat_number: chatNumber,
    text: text,
  });

  const res = await fetch(CHATGURU_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — fetch messages
  if (req.method === 'GET') {
    try {
      const { phone, limit = '50' } = req.query;
      let query = `rhf_messages?order=created_at.desc&limit=${limit}`;
      if (phone) query += `&phone=eq.${phone}`;

      const messages = await supabaseGet(query);
      return res.status(200).json({ status: 'ok', data: messages });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // POST — send message via ChatGuru + store in DB
  if (req.method === 'POST') {
    try {
      const { phone, text } = req.body;
      if (!phone || !text) {
        return res.status(400).json({ status: 'error', message: 'phone and text required' });
      }

      // Send via ChatGuru
      const chatguruResult = await chatguruSend(phone, text);

      // Store outbound message in DB
      await supabaseInsert('rhf_messages', {
        phone: phone,
        direction: 'outbound',
        content: text,
        message_type: 'chat',
        chatguru_message_id: chatguruResult.message_id || null,
      });

      // Log
      await supabaseInsert('sync_log', {
        source: 'system',
        action: 'message_sent',
        entity_type: 'message',
        entity_id: chatguruResult.message_id || phone,
        status: chatguruResult.result === 'success' ? 'success' : 'error',
        payload: { phone, text: text.substring(0, 100), chatguru_response: chatguruResult }
      });

      return res.status(200).json({ status: 'ok', chatguru: chatguruResult });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
