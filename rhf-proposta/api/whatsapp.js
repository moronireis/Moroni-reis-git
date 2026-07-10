/**
 * WhatsApp/ChatGuru Unified Handler — Vercel Serverless Function
 *
 * GET  /api/whatsapp?action=chats         → list conversations (from rhf_messages, fed by the ChatGuru webhook)
 * POST /api/whatsapp?action=send          → { phone, text } send a text message via ChatGuru
 * GET  /api/whatsapp?action=groups        → list client WhatsApp groups (chatguru_groups)
 * POST /api/whatsapp?action=group-upsert  → { chat_number, name, empresa?, processo_numero?, contato? }
 * POST /api/whatsapp?action=group-delete  → { id }
 * POST /api/whatsapp?action=summary       → { cv_id } → gera o texto de apresentação do candidato (OpenAI)
 * POST /api/whatsapp?action=send-summary  → { cv_id, group_id, text } → envia ao grupo e grava
 *                                            presented_at + sent_status='apresentado' + client_company (base do SLA)
 *
 * Note (2026-07-08): the ChatGuru s18 API has NO read actions (chat_list /
 * chat_read / chat_info all return "ação inválida" — confirmed by probe).
 * Groups são coletados pelo webhook (mensagens de grupo) + cadastro manual.
 */

import { select, insert, update } from '../lib/supabase.js';
import { sendMessage as chatguruSend } from '../lib/chatguru.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action;

  if (action === 'chats' && req.method === 'GET') return handleChats(req, res);
  if (action === 'send' && req.method === 'POST') return handleSend(req, res);
  if (action === 'groups' && req.method === 'GET') return handleGroups(req, res);
  if (action === 'group-upsert' && req.method === 'POST') return handleGroupUpsert(req, res);
  if (action === 'group-delete' && req.method === 'POST') return handleGroupDelete(req, res);
  if (action === 'summary' && req.method === 'POST') return handleSummary(req, res);
  if (action === 'send-summary' && req.method === 'POST') return handleSendSummary(req, res);

  return res.status(400).json({ error: 'Use action=chats (GET) | send (POST) | groups (GET) | group-upsert (POST) | group-delete (POST) | summary (POST) | send-summary (POST)' });
}

// ─── Chats (from rhf_messages) ───────────────────────────────────────────────

async function handleChats(req, res) {
  const agentId = req.query.agent_id || null;

  try {
    const messages = await select(
      'rhf_messages',
      'order=created_at.desc&limit=2000&select=phone,direction,content,message_type,created_at,raw_webhook,sent_by_user_id'
    );
    if (!Array.isArray(messages)) return res.status(200).json({ status: 'ok', count: 0, data: [] });

    const candidates = await select('candidates', 'select=phone,name&limit=500');
    const nameMap = {};
    if (Array.isArray(candidates)) candidates.forEach(c => { if (c.phone && c.name) nameMap[c.phone] = c.name; });

    const chatMap = {};
    messages.forEach(msg => {
      const phone = msg.phone;
      if (!phone) return;
      if (agentId && msg.sent_by_user_id && msg.sent_by_user_id !== agentId) return;

      let contactName = null;
      if (msg.raw_webhook && typeof msg.raw_webhook === 'object') contactName = msg.raw_webhook.contact_name;
      if (!contactName) contactName = nameMap[phone];
      if (!contactName) contactName = phone;

      if (!chatMap[phone]) {
        const raw = msg.raw_webhook || {};
        chatMap[phone] = {
          id: phone, phone, name: contactName,
          lastMessage: msg.content || '', lastMessageTimestamp: msg.created_at,
          direction: msg.direction, unreadCount: 0, isGroup: false, messageCount: 0,
          status: raw.status ?? raw.chat_status ?? null,
          processo: raw.processo ?? raw.process ?? raw.custom_fields?.processo ?? null,
          tags: raw.tags ?? raw.labels ?? [],
          agentId: raw.agent_id ?? null,
        };
      }
      chatMap[phone].messageCount++;
      if (msg.direction === 'inbound') chatMap[phone].unreadCount++;
      if (contactName && contactName !== phone && chatMap[phone].name === phone) chatMap[phone].name = contactName;
    });

    const chats = Object.values(chatMap);
    chats.sort((a, b) => new Date(b.lastMessageTimestamp || 0) - new Date(a.lastMessageTimestamp || 0));
    return res.status(200).json({ status: 'ok', source: 'supabase', count: chats.length, data: chats });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// ─── Send ────────────────────────────────────────────────────────────────────

async function handleSend(req, res) {
  const { phone, text, user_id } = req.body || {};
  if (!phone || !text) return res.status(400).json({ status: 'error', message: 'phone e text são obrigatórios.' });

  const phoneClean = String(phone).replace(/\D/g, '');
  if (phoneClean.length < 10) return res.status(400).json({ status: 'error', message: 'Número de telefone inválido.' });

  try {
    const result = await chatguruSend(phoneClean, String(text));

    if (result?.result === 'success' || result?.result === 'ok' || result?.code === 200 || result?.code === 201 || result?.message_id) {
      try {
        await insert('rhf_messages', {
          phone: phoneClean,
          direction: 'outbound',
          content: String(text),
          message_type: 'text',
          sent_by_user_id: user_id || null,
        }, false);
      } catch (err) { console.warn('[whatsapp/send] log failed:', err.message); }

      return res.status(200).json({ status: 'ok', message: 'Mensagem enviada.', chatguru: result });
    }

    return res.status(400).json({
      status: 'error',
      message: result?.description || result?.message || 'ChatGuru não confirmou o envio.',
      chatguru: result,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// ─── Grupos de clientes (chatguru_groups) ────────────────────────────────────

async function handleGroups(req, res) {
  try {
    const rows = await select('chatguru_groups', 'status=eq.ativo&order=name.asc&limit=200');
    return res.status(200).json({ status: 'ok', count: rows.length, data: rows });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function handleGroupUpsert(req, res) {
  try {
    const { chat_number, name, empresa, processo_numero, contato } = req.body || {};
    const num = String(chat_number || '').replace(/\D/g, '');
    if (!num || num.length < 10) return res.status(400).json({ status: 'error', message: 'chat_number inválido (use o número do grupo, só dígitos).' });
    if (!name || !String(name).trim()) return res.status(400).json({ status: 'error', message: 'name é obrigatório.' });

    const fields = {
      name: String(name).trim().slice(0, 160),
      empresa: String(empresa || '').trim().slice(0, 160) || null,
      processo_numero: String(processo_numero || '').trim().slice(0, 60) || null,
      contato: String(contato || '').trim().slice(0, 160) || null,
      updated_at: new Date().toISOString(),
    };

    const existing = await select('chatguru_groups', `chat_number=eq.${num}&limit=1`);
    let row;
    if (Array.isArray(existing) && existing.length > 0) {
      const upd = await update('chatguru_groups', `id=eq.${existing[0].id}`, { ...fields, status: 'ativo' });
      row = Array.isArray(upd) ? upd[0] : upd;
    } else {
      const ins = await insert('chatguru_groups', { chat_number: num, ...fields, source: 'manual', status: 'ativo' });
      row = Array.isArray(ins) ? ins[0] : ins;
    }
    return res.status(200).json({ status: 'ok', data: row });
  } catch (error) {
    console.error('[whatsapp group-upsert] error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function handleGroupDelete(req, res) {
  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ status: 'error', message: 'id é obrigatório.' });
    // Soft delete: sai da lista mas preserva histórico/SLA
    const rows = await update('chatguru_groups', `id=eq.${id}`, { status: 'inativo', updated_at: new Date().toISOString() });
    return res.status(200).json({ status: 'ok', data: Array.isArray(rows) ? rows[0] : rows });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// ─── Resumo do candidato para o grupo do cliente (OpenAI) ────────────────────
//
// Substitui o fluxo manual do Rodrigo: planilha → resumo digitado → grupo.
// A mensagem acompanha o PDF que a equipe já subiu no ChatGuru>Arquivos.

const SUMMARY_SYSTEM = `Você escreve a mensagem de apresentação de um candidato para o GRUPO de WhatsApp do cliente (empresa contratante), em nome da RHF Talentos.
Formato exato:
- Linha 1: *Nome do candidato* — vaga (cidade da vaga, se houver)
- 2 a 4 linhas com os pontos fortes: experiências e competências mais relevantes para a vaga
- Linha final: pretensão salarial (se houver) e disponibilidade (se houver)
Regras:
- Use SOMENTE os dados fornecidos. Nunca invente experiências, números ou disponibilidade.
- Se um dado não existir, OMITA a linha — proibido escrever "a combinar", "não informado" ou similares.
- Na linha 1, use a vaga SEM o número do processo (ex.: "Técnico em Informática (Novo Hamburgo/RS)").
- Sem saudação e sem despedida (a mensagem acompanha o currículo em PDF já disponibilizado).
- *negrito* do WhatsApp apenas no nome e em 1-2 destaques. Máximo 8 linhas. Português correto.`;

async function generateSummaryText(cv, candidate) {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  const s = cv.cv_content || {};
  const expTop = String(s.experiencia || '').split('\n\n').slice(0, 3).join('\n');
  const input = {
    nome: cv.candidate_name,
    vaga: cv.vacancy_name || '',
    cidade_candidato: candidate?.city || '',
    resumo: s.resumo || '',
    pretensao: s.pretensao || '',
    experiencias_principais: expTop,
    competencias: String(s.competencias || '').split('\n').slice(0, 6).join(', '),
    info_complementares: s.info_complementares || '',
  };

  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada no ambiente.');

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: (process.env.OPENAI_IMPORT_MODEL || 'gpt-4o-mini').trim(),
      max_tokens: 500,
      temperature: 0.3,
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM },
        { role: 'user', content: JSON.stringify(input) },
      ],
    }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || 'Falha na geração do resumo.');
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('IA não retornou texto.');
  return text;
}

async function handleSummary(req, res) {
  try {
    const { cv_id } = req.body || {};
    if (!cv_id) return res.status(400).json({ status: 'error', message: 'cv_id é obrigatório.' });

    const rows = await select('generated_cvs', `id=eq.${cv_id}&limit=1`);
    const cv = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (!cv) return res.status(404).json({ status: 'error', message: 'CV não encontrado.' });

    let candidate = null;
    if (cv.candidate_id) {
      const c = await select('candidates', `id=eq.${cv.candidate_id}&select=city&limit=1`);
      candidate = Array.isArray(c) && c.length > 0 ? c[0] : null;
    }

    const text = await generateSummaryText(cv, candidate);
    return res.status(200).json({ status: 'ok', text });
  } catch (error) {
    console.error('[whatsapp summary] error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function handleSendSummary(req, res) {
  try {
    const { cv_id, group_id, text } = req.body || {};
    if (!cv_id || !group_id || !text || !String(text).trim()) {
      return res.status(400).json({ status: 'error', message: 'cv_id, group_id e text são obrigatórios.' });
    }

    const groups = await select('chatguru_groups', `id=eq.${group_id}&limit=1`);
    const group = Array.isArray(groups) && groups.length > 0 ? groups[0] : null;
    if (!group) return res.status(404).json({ status: 'error', message: 'Grupo não encontrado.' });

    const cvs = await select('generated_cvs', `id=eq.${cv_id}&limit=1`);
    const cv = Array.isArray(cvs) && cvs.length > 0 ? cvs[0] : null;
    if (!cv) return res.status(404).json({ status: 'error', message: 'CV não encontrado.' });

    const result = await chatguruSend(group.chat_number, String(text).trim());
    const okSend = result?.result === 'success' || result?.result === 'ok' || result?.code === 200 || result?.code === 201 || result?.message_id;
    if (!okSend) {
      return res.status(400).json({
        status: 'error',
        message: result?.description || result?.message || 'ChatGuru não confirmou o envio ao grupo.',
        chatguru: result,
      });
    }

    // Apresentação registrada — é isso que abre o SLA de resposta do cliente
    try {
      await update('generated_cvs', `id=eq.${cv_id}`, {
        sent_status: 'apresentado',
        presented_at: new Date().toISOString(),
        client_company: group.empresa || group.name || null,
      });
    } catch (err) { console.warn('[whatsapp send-summary] cv update failed:', err.message); }

    try {
      await insert('rhf_messages', {
        phone: group.chat_number,
        direction: 'outbound',
        content: String(text).trim(),
        message_type: 'text',
      }, false);
    } catch (err) { console.warn('[whatsapp send-summary] log failed:', err.message); }

    return res.status(200).json({ status: 'ok', message: `Resumo enviado para o grupo "${group.name}". Apresentação registrada.` });
  } catch (error) {
    console.error('[whatsapp send-summary] error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
