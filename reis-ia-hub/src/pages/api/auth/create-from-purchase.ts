import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

// POST /api/auth/create-from-purchase
// Verifies a Ticto purchase and creates a Supabase auth user + profile.
// Body: { email, name, password }
// Returns: { ok, user_id, email } on success

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string; name?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  const password = body.password;

  if (!email || !name || !password) {
    return new Response(JSON.stringify({ error: 'Email, nome e senha são obrigatórios.' }), { status: 400 });
  }

  if (password.length < 8) {
    return new Response(JSON.stringify({ error: 'A senha deve ter no mínimo 8 caracteres.' }), { status: 400 });
  }

  const supabase = createServerClient();

  // Step 1: Find a verified purchase for this email
  const { data: purchases, error: queryError } = await supabase
    .from('ticto_purchases')
    .select('*')
    .eq('email', email)
    .eq('status', 'verified')
    .order('created_at', { ascending: false })
    .limit(1);

  if (queryError) {
    console.error('create-from-purchase - query error:', queryError);
    return new Response(JSON.stringify({ error: 'Erro interno ao verificar compra.' }), { status: 500 });
  }

  if (!purchases || purchases.length === 0) {
    return new Response(JSON.stringify({
      error: 'Compra não encontrada. Verifique se o email é o mesmo usado na compra.',
      code: 'PURCHASE_NOT_FOUND',
    }), { status: 403 });
  }

  const purchase = purchases[0];

  // Step 2: Check if auth user already exists
  const { data: existingList } = await supabase.auth.admin.listUsers({ filter: email });
  const existingUser = existingList?.users?.find(u => u.email === email);

  if (existingUser) {
    return new Response(JSON.stringify({
      error: 'Já existe uma conta com este email. Faça login.',
      code: 'ACCOUNT_EXISTS',
    }), { status: 409 });
  }

  // Step 3: Create Supabase auth user
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: name,
      source: 'ticto',
      product: purchase.product_name,
      order_id: purchase.order_id,
    },
  });

  if (createError || !created?.user) {
    console.error('create-from-purchase - createUser error:', createError);
    return new Response(JSON.stringify({ error: 'Erro ao criar conta. Tente novamente.' }), { status: 500 });
  }

  const userId = created.user.id;

  // Step 4: Upsert profile with starter role
  const profileData: Record<string, any> = {
    id: userId,
    full_name: name,
    email,
    role: 'starter',
    updated_at: new Date().toISOString(),
  };
  if (purchase.phone) profileData.phone = purchase.phone;

  await supabase.from('profiles').upsert(profileData, { onConflict: 'id', ignoreDuplicates: false });

  // Step 5: Mark purchase as used
  await supabase
    .from('ticto_purchases')
    .update({ status: 'used', used_at: new Date().toISOString() })
    .eq('id', purchase.id);

  return new Response(JSON.stringify({
    ok: true,
    user_id: userId,
    email,
  }), { status: 201 });
};
