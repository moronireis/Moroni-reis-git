/**
 * POST /api/leads/webhook
 * Receives leads from reis-ia-website typebot and saves to Supabase.
 * Creates a deal in the CRM pipeline automatically.
 *
 * Auth: accepts a simple API key via X-Webhook-Key header
 * or works without auth for now (to be secured later).
 */

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';
import { leadWebhookSchema, parseBody } from '../../../lib/validations';

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers });
  }

  const parsed = parseBody(leadWebhookSchema, rawBody);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400, headers });
  }

  const body = parsed.data as Record<string, unknown>;

  const supabase = createServerClient();

  // 1. Save lead to leads table
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .insert({
      external_id: body.id || null,
      crm_ref: body.crmRef || null,
      name: body.name,
      whatsapp: body.whatsapp,
      email: body.email,
      company: body.company,
      segment: body.segment,
      role: body.role,
      revenue: body.revenue,
      employees: body.employees,
      booking_date: body.booking?.date || null,
      booking_time: body.booking?.time || null,
      source: body.source || 'website',
      status: 'new',
      raw_data: body,
    })
    .select()
    .single();

  if (leadError) {
    console.error('[webhook] Lead save failed:', leadError);
    // If leads table doesn't exist, try deals table as fallback
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        title: `Lead: ${body.name} — ${body.company}`,
        company: body.company as string,
        contact_name: body.name as string,
        type: 'systems',
        stage: 'lead',
        value: 0,
        notes: `Fonte: ${body.source || 'website'}\nWhatsApp: ${body.whatsapp}\nEmail: ${body.email}\nSegmento: ${body.segment}\nCargo: ${body.role}\nFaturamento: ${body.revenue}\nColaboradores: ${body.employees}\nAgendamento: ${body.booking ? `${(body.booking as any).date} às ${(body.booking as any).time}` : 'Não agendou'}\nCRM Ref: ${body.crmRef}`,
        last_activity: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (dealError) {
      return new Response(JSON.stringify({ error: 'Save failed', details: dealError.message }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ success: true, type: 'deal', id: deal.id }), { status: 201, headers });
  }

  // 2. Also create a deal in the CRM pipeline
  await supabase
    .from('deals')
    .insert({
      title: `Lead: ${body.name} — ${body.company}`,
      company: body.company as string,
      contact_name: body.name as string,
      stage: 'funil type-bot',
      value: 0,
      source: body.source || 'website',
      notes: `WhatsApp: ${body.whatsapp}\nEmail: ${body.email}\nSegmento: ${body.segment}\nCargo: ${body.role}\nFaturamento: ${body.revenue}\nColaboradores: ${body.employees}\nAgendamento: ${body.booking ? `${(body.booking as any).date} às ${(body.booking as any).time}` : 'Grupo WhatsApp'}\nCRM Ref: ${body.crmRef}`,
      last_activity: new Date().toISOString().split('T')[0],
    })
    .catch(() => {});

  return new Response(JSON.stringify({ success: true, type: 'lead', id: lead.id }), { status: 201, headers });
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Key',
    },
  });
};
