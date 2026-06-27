import { createServerClient } from '../supabase-server';

export interface SendResult {
  ok: boolean;
  messageid?: string;
  error?: string;
}

/**
 * Normalize a phone number to the format UazapiGO expects: digits only,
 * with Brazilian country code prefix (55) when absent.
 *
 * Logic:
 *   1. Strip every non-digit character.
 *   2. If 10 digits (DDD + 8-digit landline), prepend "55".
 *   3. If 11 digits (DDD + 9-digit mobile), prepend "55".
 *   4. If already 12 or 13 digits, assume country code is present.
 *   5. Anything else: return stripped digits; UazapiGO will surface the error.
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 12 || digits.length === 13) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;

  return digits;
}

export async function sendWhatsAppText(
  phone: string,
  text: string,
  contactId?: string,
  campaignId?: string,
  instance?: { id: string; token: string }
): Promise<SendResult> {
  const UAZAPI_URL = import.meta.env.UAZAPI_URL || 'https://u4digital.uazapi.com';
  // Prefer the campaign's chosen sender number; fall back to the global token.
  const token = instance?.token || import.meta.env.UAZAPI_TOKEN;

  if (!UAZAPI_URL || !token) {
    return { ok: false, error: 'WhatsApp not configured' };
  }

  const normalizedPhone = normalizePhone(phone);

  try {
    const res = await fetch(`${UAZAPI_URL}/send/text?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: normalizedPhone, text }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, error: data.message || `HTTP ${res.status}` };
    }

    if (contactId) {
      const sb = createServerClient();
      await sb.from('az_messages').insert({
        contact_id: contactId,
        campaign_id: campaignId || null,
        instance_id: instance?.id || null,
        phone: normalizedPhone,
        wa_message_id: data.messageid || null,
        direction: 'outbound',
        body: text,
        status: 'sent',
      });
    }

    return { ok: true, messageid: data.messageid };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
