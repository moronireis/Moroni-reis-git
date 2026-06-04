/**
 * WhatsApp Chat Messages — Vercel Serverless Function
 *
 * GET /api/whatsapp/chat-messages?phone=5511967615987&limit=100
 * Returns messages for a specific phone from Supabase (Meta webhook data).
 */

const SUPABASE_URL = 'https://weirdpigeon-supabase.cloudfy.live';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM3Njg1MTYsImV4cCI6MTgwNTMwNDUxNn0.Hziwx8ocWnFVLHvt5DhT8nTkL2XVMa58ofjL-0hCMxw';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  var phone = req.query.phone;
  var limit = req.query.limit || '100';

  if (!phone) {
    return res.status(400).json({ status: 'error', message: 'phone query param required' });
  }

  try {
    // Fetch messages for this phone from Supabase, ordered oldest first
    var msgRes = await fetch(
      SUPABASE_URL + '/rest/v1/rhf_messages?phone=eq.' + phone + '&order=created_at.asc&limit=' + limit + '&select=id,phone,direction,content,message_type,chatguru_message_id,raw_webhook,created_at',
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } }
    );
    var messages = await msgRes.json();

    if (!Array.isArray(messages)) {
      return res.status(200).json({ status: 'ok', phone: phone, count: 0, data: [] });
    }

    // Normalize to frontend format
    var normalized = messages.map(function(msg) {
      var timestamp = Math.floor(new Date(msg.created_at).getTime() / 1000);
      var contactName = null;
      if (msg.raw_webhook && typeof msg.raw_webhook === 'object') {
        contactName = msg.raw_webhook.contact_name;
      }

      return {
        id: msg.chatguru_message_id || msg.id,
        remoteJid: phone,
        fromMe: msg.direction === 'outbound',
        body: msg.content || '[mensagem]',
        timestamp: timestamp,
        type: msg.message_type || 'chat',
        status: null,
        contactName: contactName
      };
    });

    return res.status(200).json({
      status: 'ok',
      phone: phone,
      count: normalized.length,
      data: normalized
    });

  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
