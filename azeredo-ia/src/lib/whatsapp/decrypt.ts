import { createHmac, createDecipheriv } from 'crypto';

const WA_MEDIA_INFO: Record<string, string> = {
  image:    'WhatsApp Image Keys',
  sticker:  'WhatsApp Image Keys',
  audio:    'WhatsApp Audio Keys',
  ptt:      'WhatsApp Audio Keys',
  voice:    'WhatsApp Audio Keys',
  video:    'WhatsApp Video Keys',
  document: 'WhatsApp Document Keys',
};

function hkdfSha256(inputKey: Buffer, salt: Buffer, info: Buffer, length: number): Buffer {
  const prk = createHmac('sha256', salt).update(inputKey).digest();
  const blocks = Math.ceil(length / 32);
  let prev = Buffer.alloc(0);
  const chunks: Buffer[] = [];
  for (let i = 1; i <= blocks; i++) {
    prev = createHmac('sha256', prk).update(prev).update(info).update(Buffer.from([i])).digest();
    chunks.push(prev);
  }
  return Buffer.concat(chunks).slice(0, length);
}

export function decryptWhatsAppMedia(encryptedBytes: Buffer, mediaKeyB64: string, mediaTypeLower: string): Buffer {
  const mediaKey  = Buffer.from(mediaKeyB64, 'base64');
  const salt      = Buffer.alloc(32, 0);
  const info      = Buffer.from(WA_MEDIA_INFO[mediaTypeLower] || 'WhatsApp Image Keys');
  const derived   = hkdfSha256(mediaKey, salt, info, 112);
  const iv        = derived.slice(0, 16);
  const cipherKey = derived.slice(16, 48);
  // Strip last 10 bytes (MAC) before decrypting
  const ciphertext = encryptedBytes.slice(0, -10);
  const decipher   = createDecipheriv('aes-256-cbc', cipherKey, iv);
  decipher.setAutoPadding(true);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export function stripMimeCodec(mime: string): string {
  return mime.split(';')[0].trim();
}

export function mediaTypeToExt(mime: string): string {
  const clean = stripMimeCodec(mime);
  const map: Record<string, string> = {
    'image/jpeg':    'jpg',
    'image/png':     'png',
    'image/webp':    'webp',
    'image/gif':     'gif',
    'audio/ogg':     'ogg',
    'audio/mpeg':    'mp3',
    'audio/mp4':     'm4a',
    'audio/m4a':     'm4a',
    'video/mp4':     'mp4',
    'video/quicktime':'mov',
    'application/pdf':'pdf',
  };
  return map[clean] || 'bin';
}

export function detectContentType(mediaType: string): string {
  const t = mediaType?.toLowerCase();
  if (t === 'image')    return 'image';
  if (t === 'audio' || t === 'ptt' || t === 'voice') return 'audio';
  if (t === 'video')    return 'video';
  if (t === 'document') return 'document';
  if (t === 'sticker')  return 'sticker';
  return 'text';
}
