-- Migration: Add confirmed_at column + update fonte constraint
-- Run this in Supabase SQL Editor
-- Date: 2026-05-24

-- confirmed_at for confirmation tracking
ALTER TABLE wedding_guests ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;

-- Update fonte constraint to include cha-cozinha
ALTER TABLE wedding_guests DROP CONSTRAINT IF EXISTS wedding_guests_fonte_check;
ALTER TABLE wedding_guests ADD CONSTRAINT wedding_guests_fonte_check
  CHECK (fonte IN ('save-the-date','site','convite','convite-padrinho','convite-madrinha','cha-cozinha','confirmacao-confirmado','confirmacao-recusado'));
