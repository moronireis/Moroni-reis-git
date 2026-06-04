import { createServerClient } from '../supabase-server';

export interface SendResult {
  ok: boolean;
  messageid?: string;
  error?: string;
}

export async function sendWhatsAppText(
  phone: string,
  text: string,
  contactId?: string,
  opts?: { isAutomation?: boolean; automationId?: string }
): Promise<SendResult> {
  const UAZAPI_URL = import.meta.env.UAZAPI_URL;
  const UAZAPI_TOKEN = import.meta.env.UAZAPI_TOKEN;

  if (!UAZAPI_URL || !UAZAPI_TOKEN) {
    return { ok: false, error: 'WhatsApp not configured' };
  }

  const cleanPhone = phone.replace(/\D/g, '');

  try {
    const res = await fetch(`${UAZAPI_URL}/send/text?token=${UAZAPI_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: cleanPhone, text }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok && !data.messageid) {
      return { ok: false, error: data.message || `HTTP ${res.status}` };
    }

    if (contactId) {
      const sb = createServerClient();
      await sb.from('marpe_messages').insert({
        contact_id: contactId,
        wa_message_id: data.messageid || null,
        direction: 'outbound',
        content_type: 'text',
        body: text,
        status: 'sent',
        is_from_automation: opts?.isAutomation || false,
        metadata: opts?.automationId ? { automation_id: opts.automationId } : null,
      });
    }

    return { ok: true, messageid: data.messageid };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
