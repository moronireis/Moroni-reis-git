-- Migration 008: grupos de WhatsApp dos clientes (Fase 2 — resumo → grupo + SLA)
-- Coleta via webhook do ChatGuru (a API s18 não tem ações de leitura) + cadastro manual.
-- Apply with: node scripts/apply-migration.js migrations/008_chatguru_groups.sql

CREATE TABLE IF NOT EXISTS chatguru_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_number text UNIQUE NOT NULL,
  name text,
  empresa text,
  processo_numero text,
  contato text,
  status text DEFAULT 'ativo',
  tags jsonb DEFAULT '[]',
  raw jsonb,
  source text,                          -- webhook | manual
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chatguru_groups_status ON chatguru_groups (status, updated_at DESC);
