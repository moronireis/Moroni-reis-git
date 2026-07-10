/**
 * Metrics — Dashboard de acompanhamento (Fase 2) — Vercel Serverless Function
 *
 * GET /api/metrics?action=dashboard&days=90
 *
 * Agregações que substituem a planilha/pivot do Rodrigo:
 *  - Currículos por recrutador (created_by_name)
 *  - Funil de envio: gerados → preparados → disponibilizados (ChatGuru Arquivos) → apresentados → respondidos
 *  - SLA de resposta do cliente: média de client_response_at - presented_at (referência manual: 13,5 dias)
 *  - Apresentados por empresa (client_company)
 *  - Última atualização por processo (vacancies abertas; desatualizada > 7 dias)
 *
 * Usa o slot de função reservado no plano (11/12).
 */

import { select } from '../lib/supabase.js';

const STALE_DAYS = 7;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action || 'dashboard';
  if (action === 'dashboard' && req.method === 'GET') return handleDashboard(req, res);

  return res.status(400).json({ error: 'Use action=dashboard (GET)' });
}

async function handleDashboard(req, res) {
  try {
    const days = Math.min(parseInt(req.query.days, 10) || 90, 365);
    const since = new Date(Date.now() - days * 86400000).toISOString();

    const [cvs, vacancies] = await Promise.all([
      select('generated_cvs',
        `created_at=gte.${since}&order=created_at.desc&limit=1000` +
        `&select=id,created_at,created_by_name,candidate_name,vacancy_name,sent_status,sent_at,presented_at,client_response_at,client_company`),
      select('vacancies', 'order=created_at.desc&limit=300&select=id,title,client_name,processo_numero,status,updated_at,created_at'),
    ]);

    const rows = Array.isArray(cvs) ? cvs : [];
    const vagas = Array.isArray(vacancies) ? vacancies : [];
    const now = Date.now();

    // ── Funil de envio ────────────────────────────────────────
    const stage = s => rows.filter(cv => s.includes(cv.sent_status)).length;
    const funil = {
      gerados: rows.length,
      preparados: stage(['preparado', 'chatguru_arquivo', 'apresentado']),
      disponibilizados: stage(['chatguru_arquivo', 'apresentado']),
      apresentados: rows.filter(cv => cv.presented_at || cv.sent_status === 'apresentado').length,
      respondidos: rows.filter(cv => cv.client_response_at).length,
    };

    // ── Currículos por recrutador ─────────────────────────────
    const porRecrutador = {};
    for (const cv of rows) {
      const key = cv.created_by_name || 'Sem identificação';
      porRecrutador[key] = (porRecrutador[key] || 0) + 1;
    }

    // ── Apresentados por empresa ──────────────────────────────
    const porEmpresa = {};
    for (const cv of rows) {
      if (!cv.presented_at && cv.sent_status !== 'apresentado') continue;
      const key = cv.client_company || 'Sem empresa';
      porEmpresa[key] = (porEmpresa[key] || 0) + 1;
    }

    // ── SLA de resposta do cliente (dias) ─────────────────────
    const slaSamples = rows
      .filter(cv => cv.presented_at && cv.client_response_at)
      .map(cv => (new Date(cv.client_response_at) - new Date(cv.presented_at)) / 86400000)
      .filter(d => d >= 0);
    const slaMedioDias = slaSamples.length > 0
      ? Math.round((slaSamples.reduce((a, b) => a + b, 0) / slaSamples.length) * 10) / 10
      : null;

    // ── Aguardando resposta (SLA aberto) ──────────────────────
    const aguardando = rows
      .filter(cv => cv.presented_at && !cv.client_response_at)
      .map(cv => ({
        cv_id: cv.id,
        candidate_name: cv.candidate_name,
        client_company: cv.client_company,
        presented_at: cv.presented_at,
        dias_aguardando: Math.floor((now - new Date(cv.presented_at)) / 86400000),
      }))
      .sort((a, b) => b.dias_aguardando - a.dias_aguardando)
      .slice(0, 20);

    // ── Última atualização por processo (vagas abertas) ───────
    const processos = vagas
      .filter(v => v.status !== 'fechada')
      .map(v => {
        const ref = new Date(v.updated_at || v.created_at || now);
        const diasParado = Math.floor((now - ref) / 86400000);
        return {
          id: v.id,
          title: v.title,
          client_name: v.client_name,
          processo_numero: v.processo_numero,
          dias_sem_atualizacao: diasParado,
          desatualizada: diasParado > STALE_DAYS,
        };
      })
      .sort((a, b) => b.dias_sem_atualizacao - a.dias_sem_atualizacao)
      .slice(0, 30);

    return res.status(200).json({
      status: 'ok',
      periodo_dias: days,
      funil,
      sla: { media_dias: slaMedioDias, amostras: slaSamples.length, referencia_manual_dias: 13.5 },
      por_recrutador: Object.entries(porRecrutador).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total),
      por_empresa: Object.entries(porEmpresa).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total),
      aguardando_resposta: aguardando,
      processos,
    });
  } catch (error) {
    console.error('[metrics dashboard] error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
