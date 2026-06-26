import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ locals, params }) => {
  const profile = requireAuth(locals as any);
  if (profile instanceof Response) return profile;

  const { id } = params;
  if (!id) return json({ error: 'id required' }, 400);

  const sb = createServerClient();

  const { data: contact, error } = await sb
    .from('az_contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !contact) return json({ error: 'Contact not found' }, 404);

  // Fetch brands
  const { data: cb } = await sb
    .from('az_contact_brands')
    .select('contact_id, vendedores, az_brands(id, name, slug)')
    .eq('contact_id', id);

  const brands = (cb || []).map((row: any) => ({
    ...row.az_brands,
    vendedores: row.vendedores,
  }));

  return json({ contact: { ...contact, brands } });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
