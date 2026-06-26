/**
 * POST /api/webhook/whatsapp?token=INSTANCE_TOKEN
 *
 * UazapiGO delivers all inbound events here.
 * Pipeline (per Protocolo Chat WPP):
 *   1. Identify instance by token query param
 *   2. Extract fields from webhook payload
 *   3. Dedup by wa_message_id
 *   4. Find-or-create conversation
 *   5. If media: download CDN → decrypt → upload Storage (immediate, CDN URLs expire)
 *   6. Insert az_messages
 *   7. Update az_conversations (last_message, unread_count)
 */

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';
import { detectContentType } from '../../../lib/whatsapp/decrypt';
import { downloadAndStoreMedia } from '../../../lib/whatsapp/media';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const token = url.searchParams.get('token');

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  const sb = createServerClient();

  // ── 1. Identify instance ────────────────────────────────────────────
  let instanceId: string | null = null;
  if (token) {
    const { data: inst } = await sb
      .from('az_whatsapp_instances')
      .select('id')
      .eq('token', token)
      .single();
    instanceId = inst?.id ?? null;
  }

  // ── 2. Parse webhook payload ─────────────────────────────────────────
  // UazapiGO wraps events: { type, data } or sends the message object directly
  const msg = payload?.data ?? payload;

  const fromMe: boolean      = msg?.fromMe ?? msg?.key?.fromMe ?? false;
  const remoteJid: string    = msg?.chatid ?? msg?.key?.remoteJid ?? '';
  const pushName: string     = msg?.pushName ?? '';
  const waMessageId: string  = msg?.id ?? msg?.key?.id ?? '';
  const msgType: string      = msg?.type ?? 'text';          // 'text' | 'media' | 'chat'
  const mediaType: string    = msg?.mediaType ?? '';          // 'image'|'audio'|'ptt'|'video'|'document'|'sticker'
  const bodyText: string     = msg?.body ?? msg?.content?.text ?? msg?.text ?? '';
  const cdnUrl: string       = msg?.content?.URL ?? msg?.content?.url ?? '';
  const mediaKey: string     = msg?.content?.mediaKey ?? '';
  const rawMime: string      = msg?.content?.mimetype ?? msg?.content?.mimeType ?? '';

  // Ignore outbound (sent by us) and empty JIDs
  if (!remoteJid) return new Response('OK', { status: 200 });
  // Optionally skip fromMe (outbound) — we already save those via send API
  if (fromMe) return new Response('OK', { status: 200 });

  const isMedia = (msgType === 'media' || !!mediaType) && !!cdnUrl;
  const contentType = isMedia ? detectContentType(mediaType || msgType) : 'text';

  // ── 3. Dedup by wa_message_id ─────────────────────────────────────────
  if (waMessageId) {
    const { data: existing } = await sb
      .from('az_messages')
      .select('id')
      .eq('wa_message_id', waMessageId)
      .maybeSingle();
    if (existing) return new Response('OK', { status: 200 });
  }

  // ── 4. Find-or-create conversation ───────────────────────────────────
  let conversation: any = null;
  const { data: existingConv } = await sb
    .from('az_conversations')
    .select('id, unread_count')
    .eq('remote_jid', remoteJid)
    .eq('instance_id', instanceId ?? '')
    .maybeSingle();

  if (existingConv) {
    conversation = existingConv;
  } else if (instanceId) {
    const { data: newConv } = await sb
      .from('az_conversations')
      .insert({
        instance_id: instanceId,
        remote_jid: remoteJid,
        remote_name: pushName || null,
        status: 'open',
        last_direction: 'inbound',
        unread_count: 0,
      })
      .select('id, unread_count')
      .single();
    conversation = newConv;
  }

  // ── 5. Handle media: download → decrypt → store ───────────────────────
  let mediaUrl: string | null = null;
  let finalMime: string | null = null;

  if (isMedia && cdnUrl) {
    const contactRef = conversation?.id ?? waMessageId;
    const msgRef = waMessageId || Date.now().toString();
    try {
      const result = await downloadAndStoreMedia(
        cdnUrl,
        mediaKey || null,
        rawMime || 'application/octet-stream',
        mediaType || msgType,
        contactRef,
        msgRef,
      );
      mediaUrl  = result.url;
      finalMime = result.mime;
    } catch (e: any) {
      console.error('[webhook] media pipeline error:', e.message);
      // Continue — save message without media_url, better than dropping it
    }
  }

  // ── 6. Insert message ─────────────────────────────────────────────────
  const messageBody = isMedia ? (bodyText || mediaType || contentType) : bodyText;

  await sb.from('az_messages').insert({
    conversation_id: conversation?.id ?? null,
    instance_id: instanceId,
    remote_jid: remoteJid,
    direction: 'inbound',
    body: messageBody,
    content_type: contentType,
    media_url: mediaUrl,
    media_mime: finalMime,
    wa_message_id: waMessageId || null,
    status: 'received',
    sent_at: new Date().toISOString(),
    metadata: {
      push_name: pushName,
      media_type: mediaType,
      raw_mime: rawMime,
    },
  });

  // ── 7. Update conversation ────────────────────────────────────────────
  if (conversation?.id) {
    await sb.from('az_conversations').update({
      last_message: isMedia ? `[${contentType}]` : messageBody,
      last_message_at: new Date().toISOString(),
      last_direction: 'inbound',
      remote_name: pushName || undefined,
      unread_count: (conversation.unread_count ?? 0) + 1,
      updated_at: new Date().toISOString(),
    }).eq('id', conversation.id);
  }

  return new Response('OK', { status: 200 });
};
