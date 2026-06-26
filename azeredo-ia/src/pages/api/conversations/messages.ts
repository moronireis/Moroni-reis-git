import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const conversation_id = url.searchParams.get('conversation_id');
  if (!conversation_id) return new Response(JSON.stringify({ error: 'conversation_id required' }), { status: 400 });

  const sb = createServerClient();
  const { data, error } = await sb
    .from('az_messages')
    .select('*')
    .eq('conversation_id', conversation_id)
    .order('sent_at', { ascending: true })
    .limit(100);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const sb = createServerClient();
  const { conversation_id, text } = await request.json();
  if (!conversation_id || !text) return new Response(JSON.stringify({ error: 'conversation_id and text required' }), { status: 400 });

  // Get conversation to find instance token and remote_jid
  const { data: conv, error: convErr } = await sb
    .from('az_conversations')
    .select('remote_jid, instance_id, az_whatsapp_instances(token, uazapi_name)')
    .eq('id', conversation_id)
    .single();

  if (convErr || !conv) return new Response(JSON.stringify({ error: 'Conversation not found' }), { status: 404 });

  const instance = (conv as any).az_whatsapp_instances;
  const UAZAPI_URL = import.meta.env.UAZAPI_URL || 'https://u4digital.uazapi.com';

  // Send via UazapiGO
  const sendResp = await fetch(`${UAZAPI_URL}/message/text`, {
    method: 'POST',
    headers: { token: instance.token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: conv.remote_jid, text }),
  });
  const sendBody = await sendResp.json();

  if (!sendResp.ok) return new Response(JSON.stringify({ error: 'Send failed', detail: sendBody }), { status: 500 });

  // Save message to DB
  const { data: msg, error: msgErr } = await sb
    .from('az_messages')
    .insert({
      conversation_id,
      instance_id: conv.instance_id,
      remote_jid: conv.remote_jid,
      direction: 'outbound',
      body: text,
      sent_at: new Date().toISOString(),
    })
    .select()
    .single();

  // Update conversation last_message
  await sb.from('az_conversations').update({
    last_message: text,
    last_message_at: new Date().toISOString(),
    last_direction: 'outbound',
    updated_at: new Date().toISOString(),
  }).eq('id', conversation_id);

  if (msgErr) return new Response(JSON.stringify({ error: msgErr.message }), { status: 500 });
  return new Response(JSON.stringify(msg), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
