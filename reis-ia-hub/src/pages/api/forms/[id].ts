import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  let query = supabase
    .from('branding_forms')
    .select('*')
    .eq('id', id);

  if (!isAdmin) {
    query = query.eq('user_id', profile.id);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

export const PATCH: APIRoute = async ({ params, request, locals }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  // Fetch existing form to check ownership
  let checkQuery = supabase
    .from('branding_forms')
    .select('id, user_id, status')
    .eq('id', id);

  if (!isAdmin) {
    checkQuery = checkQuery.eq('user_id', profile.id);
  }

  const { data: existing, error: checkError } = await checkQuery.single();

  if (checkError || !existing) {
    return new Response(JSON.stringify({ error: 'Not found or forbidden' }), { status: 404 });
  }

  const body = await request.json();
  const { data: formData, status, review_notes } = body;

  const updatePayload: Record<string, unknown> = {};

  if (formData !== undefined) {
    updatePayload.data = formData;
  }

  if (status !== undefined) {
    const validStatuses = ['draft', 'submitted', 'reviewed', 'approved'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
    }
    // Only admin can set reviewed/approved
    if ((status === 'reviewed' || status === 'approved') && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
    updatePayload.status = status;

    if (status === 'reviewed' || status === 'approved') {
      updatePayload.reviewed_by = profile.id;
      updatePayload.reviewed_at = new Date().toISOString();
    }
  }

  if (review_notes !== undefined && isAdmin) {
    updatePayload.review_notes = review_notes;
  }

  updatePayload.updated_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from('branding_forms')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // If status changed to 'submitted', create notification for admins
  if (status === 'submitted') {
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    const formTypeLabels: Record<string, string> = {
      'personal-branding': 'Personal Branding',
      'company-branding': 'Company Branding',
      'product-branding': 'Product Branding',
      'movement-branding': 'Movement Branding',
    };

    const userName = profile.full_name || 'Usuario';
    const formLabel = formTypeLabels[updated.form_type] || updated.form_type;

    if (admins && admins.length > 0) {
      const notifications = admins.map(admin => ({
        user_id: admin.id,
        title: 'Formulario enviado',
        body: `${userName} enviou ${formLabel} para revisao`,
        link: '/admin/forms',
        read: false,
      }));

      await supabase.from('notifications').insert(notifications);
    }

    // Save to hub_knowledge for permanent record
    const formContent = typeof updated.data === 'object' ? JSON.stringify(updated.data, null, 2) : String(updated.data || '');
    await supabase.from('hub_knowledge').insert({
      user_id: profile.id,
      user_name: userName,
      category: 'form_response',
      title: `${formLabel} — ${userName}`,
      summary: `Formulário ${formLabel} enviado por ${userName}`,
      content: formContent,
      source: `branding_form:${updated.form_type}`,
      tags: [updated.form_type, 'branding', 'form'],
    }).then(() => {}).catch(() => {});
  }

  return new Response(JSON.stringify(updated), { status: 200 });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const profile = locals.profile;
  if (!profile?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  const supabase = createServerClient();
  const isAdmin = profile.role === 'admin';

  let deleteQuery = supabase
    .from('branding_forms')
    .delete()
    .eq('id', id);

  if (!isAdmin) {
    deleteQuery = deleteQuery.eq('user_id', profile.id);
  }

  const { error } = await deleteQuery;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
