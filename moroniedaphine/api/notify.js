// Centralized notification endpoint — Email (Resend) + WhatsApp (Evolution)
// Called by all forms and webhooks

const RESEND_KEY = 're_MTugi3Pt_Pks8TtxzvaZWYiPxRSKmdfbs';
const EVOLUTION_URL = 'https://weirdpigeon-evolution.cloudfy.live';
const EVOLUTION_KEY = 'tqXOKoUIAH0llngaxg9k2dYnx5CpHrnp';
const EVOLUTION_INSTANCE = 'Reis';
const NOTIFY_PHONES = ['5511963341710', '5511967615987'];
const NOTIFY_EMAILS = ['moronif.reis@gmail.com', 'daphine.oliveira@gmail.com'];

export default async function handler(req, res) {
  // CORS headers for client-side calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { event, nome, whatsapp, fonte, valor, detalhes } = req.body;

    // Build messages based on event type
    let emailSubject, emailBody, whatsappMsg;

    switch (event) {
      case 'cadastro':
        emailSubject = `Novo cadastro — ${nome} (${fonte})`;
        emailBody = `
          <h2>Novo cadastro no site do casamento</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
          <p><strong>Fonte:</strong> ${fonte}</p>
          ${detalhes ? `<p><strong>Detalhes:</strong> ${detalhes}</p>` : ''}
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          <hr><p><a href="https://moroniedaphine.vercel.app/admin">Abrir painel de convidados</a></p>
        `;
        whatsappMsg = `🔔 *Novo Cadastro — ${fonte}*\n\n👤 *${nome}*\n📱 ${whatsapp || 'N/A'}\n📍 Fonte: ${fonte}\n⏰ ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}\n\n🔗 moroniedaphine.vercel.app/admin`;
        break;

      case 'inicio_pagamento':
        emailSubject = `🛒 Início de pagamento — ${nome} (${detalhes || ''})`;
        emailBody = `
          <h2>Alguém iniciou um pagamento!</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
          <p><strong>Valor:</strong> ${valor}</p>
          <p><strong>Método:</strong> ${detalhes}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          <hr><p><a href="https://moroniedaphine.vercel.app/admin">Abrir painel</a></p>
        `;
        whatsappMsg = `🛒 *Início de Pagamento!*\n\n👤 *${nome}*\n📱 ${whatsapp || 'N/A'}\n💵 ${valor}\n💳 ${detalhes || ''}\n⏰ ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
        break;

      case 'pagamento':
        emailSubject = `✅ Pagamento CONFIRMADO — R$ ${valor}`;
        emailBody = `
          <h2>Pagamento confirmado!</h2>
          <p><strong>Valor:</strong> R$ ${valor}</p>
          <p><strong>Pagador:</strong> ${nome || 'N/A'}</p>
          <p><strong>Método:</strong> ${detalhes || 'N/A'}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          <hr><p><a href="https://moroniedaphine.vercel.app/admin">Abrir painel</a></p>
        `;
        whatsappMsg = `✅ *Pagamento CONFIRMADO!*\n\n💵 *R$ ${valor}*\n👤 ${nome || 'N/A'}\n💳 ${detalhes || 'N/A'}\n⏰ ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
        break;

      case 'rsvp':
        emailSubject = `RSVP confirmado — ${nome}`;
        emailBody = `
          <h2>Presença confirmada!</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
          ${detalhes ? `<p><strong>Detalhes:</strong> ${detalhes}</p>` : ''}
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          <hr><p><a href="https://moroniedaphine.vercel.app/admin">Abrir painel</a></p>
        `;
        whatsappMsg = `✅ *Presença Confirmada!*\n\n👤 *${nome}*\n📱 ${whatsapp || 'N/A'}\n⏰ ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}\n\n🔗 moroniedaphine.vercel.app/admin`;
        break;

      default:
        emailSubject = `Notificação — ${event || 'evento'}`;
        emailBody = `<h2>${event}</h2><p>${JSON.stringify(req.body)}</p>`;
        whatsappMsg = `🔔 *${event}*\n\n${JSON.stringify(req.body, null, 2)}`;
    }

    // Send email via Resend
    const emailPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`
      },
      body: JSON.stringify({
        from: 'Casamento MD <onboarding@resend.dev>',
        to: NOTIFY_EMAILS,
        subject: emailSubject,
        html: emailBody
      })
    }).catch(e => console.log('Email error:', e));

    // Send WhatsApp via Evolution API (both numbers)
    const whatsappPromises = NOTIFY_PHONES.map(phone =>
      fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_KEY
        },
        body: JSON.stringify({
          number: phone,
          text: whatsappMsg
        })
      }).catch(e => console.log('WhatsApp error:', e))
    );

    // Fire all in parallel
    await Promise.all([emailPromise, ...whatsappPromises]);

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Notify error:', error);
    return res.status(200).json({ sent: false, error: error.message });
  }
}
