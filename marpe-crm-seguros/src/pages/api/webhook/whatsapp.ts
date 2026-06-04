import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

// POST /api/webhook/whatsapp — receives messages from UazapiGO
// Actual payload format from UazapiGO:
// { BaseUrl, EventType, chat: { wa_chatid, name, phone }, message: { chatid, text, content: {text}, fromMe, messageid, type, wasSentByApi, messageTimestamp }, owner, token }
export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try { body = await request.json(); } catch { return new Response('OK', { status: 200 }); }

  // Only process "messages" events
  if (body.EventType && body.EventType !== 'messages') {
    return new Response('OK', { status: 200 });
  }

  const msg = body.message || {};
  const chat = body.chat || {};

  // Extract fields from actual UazapiGO format
  const chatid = msg.chatid || chat.wa_chatid || '';
  const phone = chatid.replace('@s.whatsapp.net', '').replace('@g.us', '');
  const messageBody = msg.text || msg.content?.text || '';
  const fromMe = msg.fromMe || false;
  const messageId = msg.messageid || msg.id || '';
  const messageType = msg.type || msg.messageType || 'text';
  const timestamp = msg.messageTimestamp || Date.now();
  const senderName = chat.name || msg.senderName || phone;
  const isGroup = msg.isGroup || false;

  // Skip group messages and empty messages
  if (!phone || !messageBody || isGroup) {
    return new Response('OK', { status: 200 });
  }

  const sb = createServerClient();

  // Find or create contact
  let contactId: string | null = null;

  // Try exact phone match first
  const { data: existing } = await sb
    .from('marpe_contacts')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();

  if (existing?.id) {
    contactId = existing.id;
  } else {
    // Try last 8 digits match
    const { data: partial } = await sb
      .from('marpe_contacts')
      .select('id')
      .ilike('phone', `%${phone.slice(-8)}%`)
      .maybeSingle();

    if (partial?.id) {
      contactId = partial.id;
    } else {
      // Create new contact from WhatsApp
      const { data: created } = await sb
        .from('marpe_contacts')
        .insert({
          name: senderName || phone,
          phone,
          source: 'whatsapp',
        })
        .select('id')
        .single();
      contactId = created?.id || null;
    }
  }

  if (!contactId) return new Response('OK', { status: 200 });

  // Avoid duplicate messages
  if (messageId) {
    const { data: dup } = await sb
      .from('marpe_messages')
      .select('id')
      .eq('wa_message_id', messageId)
      .maybeSingle();
    if (dup?.id) return new Response('OK', { status: 200 });
  }

  // Save message
  await sb.from('marpe_messages').insert({
    contact_id: contactId,
    wa_message_id: messageId || null,
    direction: fromMe ? 'outbound' : 'inbound',
    content_type: messageType.toLowerCase().includes('image') ? 'image'
                : messageType.toLowerCase().includes('audio') ? 'audio'
                : messageType.toLowerCase().includes('video') ? 'video'
                : messageType.toLowerCase().includes('document') ? 'document'
                : 'text',
    body: messageBody,
    status: fromMe ? 'sent' : 'delivered',
    metadata: { event_type: body.EventType, timestamp, instance: body.instanceName },
  });

  return new Response('OK', { status: 200 });
};

// GET for webhook verification
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: 'webhook active' }), { status: 200 });
};
