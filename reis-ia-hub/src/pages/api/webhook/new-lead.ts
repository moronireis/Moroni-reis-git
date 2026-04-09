import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';
import { newLeadWebhookSchema, parseBody } from '../../../lib/validations';

export const prerender = false;

// Webhook endpoint: receives new leads and creates notifications
// Called by marketing forms, diagnostico, external sources
// POST /api/webhook/new-lead
// Body: { name, email, phone?, instagram?, source, form_type?, cargo?, faturamento?, objetivo?, notes? }
// Header: x-webhook-key for basic auth

export const POST: APIRoute = async ({ request }) => {
  // Basic auth via header
  const authKey = request.headers.get('x-webhook-key');
  if (!authKey || authKey !== import.meta.env.WEBHOOK_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const parsed = parseBody(newLeadWebhookSchema, rawBody);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400 });
  }

  const { name, email, phone, instagram, source, form_type, cargo, faturamento, objetivo, notes } = parsed.data;

  const supabase = createServerClient();

  // Check if contact already exists
  let isNew = false;
  let contactId = '';

  if (email) {
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      contactId = existing.id;
      // Update existing contact with any new info
      const updates: Record<string, any> = {};
      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (instagram) updates.instagram = instagram;
      if (cargo) updates.cargo = cargo;
      if (faturamento) updates.faturamento = faturamento;
      if (objetivo) updates.objetivo = objetivo;
      if (notes) updates.notes = notes;
      if (source) updates.source = source;

      if (Object.keys(updates).length > 0) {
        await supabase.from('contacts').update(updates).eq('id', contactId);
      }
    } else {
      isNew = true;
      // Create new contact
      const { data: newContact } = await supabase
        .from('contacts')
        .insert({
          name: name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          email: email.toLowerCase(),
          phone: phone || '',
          instagram: instagram || '',
          source: source || 'Website',
          form_type: form_type || '',
          cargo: cargo || '',
          faturamento: faturamento || '',
          objetivo: objetivo || '',
          notes: notes || '',
          tags: source ? [source] : ['Website'],
        })
        .select('id')
        .single();

      if (newContact) contactId = newContact.id;
    }
  } else {
    isNew = true;
  }

  // Get all admin users to notify
  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin');

  // Create notification for each admin
  const displayName = name || email?.split('@')[0] || 'Lead';
  const sourceLabel = source || form_type || 'Website';

  const notifTitle = isNew ? 'Novo lead' : 'Lead atualizado';
  const notifBody = isNew
    ? `${displayName} entrou via ${sourceLabel}${faturamento ? ` — Fat: ${faturamento}` : ''}${cargo ? ` — ${cargo}` : ''}`
    : `${displayName} preencheu mais informações via ${sourceLabel}`;

  if (admins && admins.length > 0) {
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type: isNew ? 'system' : 'message',
      title: notifTitle,
      body: notifBody,
      link: '/admin/crm',
      read: false,
    }));

    await supabase.from('notifications').insert(notifications);
  }

  return new Response(JSON.stringify({
    ok: true,
    is_new: isNew,
    contact_id: contactId,
    notification_sent: (admins?.length || 0) > 0,
  }), { status: isNew ? 201 : 200 });
};
