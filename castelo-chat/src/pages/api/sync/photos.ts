import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { createServerSupabase } from '../../../lib/supabase-server';

const UAZAPI_URL = process.env.UAZAPI_URL_1 || '';
const UAZAPI_TOKEN = process.env.UAZAPI_TOKEN_1 || '';

// Attempt to fetch a profile picture URL from UazapiGO for a given phone number.
// Tries multiple endpoint patterns — UazapiGO versions differ.
async function fetchProfilePic(phone: string): Promise<string | null> {
  const endpoints = [
    async () => {
      const r = await fetch(`${UAZAPI_URL}/contacts/profile-picture?token=${UAZAPI_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: phone }),
      });
      if (!r.ok) return null;
      const d = await r.json();
      return (d as Record<string, unknown>)?.profilePicUrl as string
        || (d as Record<string, unknown>)?.url as string
        || (d as Record<string, unknown>)?.image as string
        || (d as Record<string, unknown>)?.photo as string
        || null;
    },
    async () => {
      const r = await fetch(`${UAZAPI_URL}/contact/profile-picture?token=${UAZAPI_TOKEN}&number=${encodeURIComponent(phone)}`);
      if (!r.ok) return null;
      const d = await r.json();
      return (d as Record<string, unknown>)?.profilePicUrl as string
        || (d as Record<string, unknown>)?.url as string
        || null;
    },
    async () => {
      const r = await fetch(`${UAZAPI_URL}/contact/get?token=${UAZAPI_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: phone }),
      });
      if (!r.ok) return null;
      const d = await r.json();
      return (d as Record<string, unknown>)?.profilePicUrl as string
        || (d as Record<string, unknown>)?.pictureUrl as string
        || null;
    },
    async () => {
      const r = await fetch(`${UAZAPI_URL}/contacts/get?token=${UAZAPI_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: phone }),
      });
      if (!r.ok) return null;
      const d = await r.json();
      return (d as Record<string, unknown>)?.profilePicUrl as string
        || (d as Record<string, unknown>)?.pictureUrl as string
        || null;
    },
  ];

  for (const attempt of endpoints) {
    try {
      const picUrl = await attempt();
      if (picUrl && typeof picUrl === 'string' && picUrl.startsWith('http')) return picUrl;
    } catch {
      // try next
    }
  }
  return null;
}

// GET — returns how many contacts still need photos
export const GET: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) return new Response('Unauthorized', { status: 401 });

  const supabase = createServerSupabase();

  const [{ count: missing }, { count: hasPhoto }] = await Promise.all([
    supabase
      .from('castelo_contacts')
      .select('id', { count: 'exact', head: true })
      .is('photo_url', null)
      .eq('is_group', false),
    supabase
      .from('castelo_contacts')
      .select('id', { count: 'exact', head: true })
      .not('photo_url', 'is', null),
  ]);

  return new Response(JSON.stringify({
    missing_photos: missing || 0,
    have_photos: hasPhoto || 0,
  }), { headers: { 'Content-Type': 'application/json' } });
};

// POST — batched photo sync
// Body: { limit?: number, offset?: number }
export const POST: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) return new Response('Unauthorized', { status: 401 });

  if (!UAZAPI_URL || !UAZAPI_TOKEN) {
    return new Response(JSON.stringify({ error: 'Instance not configured' }), { status: 500 });
  }

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* defaults */ }

  const batchLimit = Math.min(Number(body.limit) || 30, 100);
  const offset = Number(body.offset) || 0;

  const supabase = createServerSupabase();

  // Fetch contacts missing photos
  const { data: contacts, error } = await supabase
    .from('castelo_contacts')
    .select('id, phone, photo_url')
    .is('photo_url', null)
    .eq('is_group', false)
    .not('phone', 'is', null)
    .range(offset, offset + batchLimit - 1)
    .order('id');

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  if (!contacts || contacts.length === 0) {
    return new Response(JSON.stringify({ updated: 0, skipped: 0, failed: 0, done: true }), { status: 200 });
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const contact of contacts) {
    const phone = (contact.phone as string) || '';
    const digits = phone.replace(/\D/g, '');
    if (!digits || digits.length < 8) { skipped++; continue; }

    // Ensure Brazilian country code
    const normalized = digits.startsWith('55') ? digits : `55${digits}`;

    try {
      const picUrl = await fetchProfilePic(normalized);
      if (picUrl) {
        await supabase
          .from('castelo_contacts')
          .update({ photo_url: picUrl })
          .eq('id', contact.id as string);
        updated++;
      } else {
        skipped++;
      }
    } catch {
      failed++;
    }

    // Rate limit: avoid hammering UazapiGO
    await new Promise(r => setTimeout(r, 120));
  }

  const hasMore = contacts.length === batchLimit;

  return new Response(JSON.stringify({
    updated,
    skipped,
    failed,
    next_offset: hasMore ? offset + batchLimit : null,
    done: !hasMore,
    processed: contacts.length,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
