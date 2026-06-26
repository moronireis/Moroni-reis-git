import { decryptWhatsAppMedia, stripMimeCodec, mediaTypeToExt } from './decrypt';
import { createServerClient } from '../supabase-server';

const BUCKET = 'az-media';

export interface MediaResult {
  url: string;
  mime: string;
}

/**
 * Download from WhatsApp CDN, decrypt if needed, upload to Supabase Storage.
 * Returns the public URL and clean MIME type.
 *
 * CRITICAL: CDN URLs expire — must be called immediately on webhook receipt.
 */
export async function downloadAndStoreMedia(
  cdnUrl: string,
  mediaKey: string | null | undefined,
  rawMime: string,
  mediaType: string,
  contactId: string,
  messageId: string,
): Promise<MediaResult> {
  // 1. Fetch from CDN (timeout 18s)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  let encBytes: Buffer;
  try {
    const resp = await fetch(cdnUrl, { signal: controller.signal });
    if (!resp.ok) throw new Error(`CDN fetch failed: ${resp.status}`);
    encBytes = Buffer.from(await resp.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }

  // 2. Decrypt if mediaKey present
  let finalBytes: Buffer;
  if (mediaKey) {
    try {
      finalBytes = decryptWhatsAppMedia(encBytes, mediaKey, mediaType.toLowerCase());
    } catch {
      // Fallback: use raw bytes (some providers pre-decrypt)
      finalBytes = encBytes;
    }
  } else {
    finalBytes = encBytes;
  }

  // 3. Clean MIME (strip codec params — Supabase rejects them)
  const cleanMime = stripMimeCodec(rawMime);
  const ext = mediaTypeToExt(rawMime);

  // 4. Upload to Supabase Storage: {contactId}/{messageId}.{ext}
  const sb = createServerClient();
  const path = `${contactId}/${messageId}.${ext}`;

  const { error: uploadError } = await sb.storage
    .from(BUCKET)
    .upload(path, finalBytes, { contentType: cleanMime, upsert: true });

  if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

  // 5. Get public URL
  const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path);
  if (!urlData?.publicUrl) throw new Error('Could not get public URL');

  return { url: urlData.publicUrl, mime: cleanMime };
}
