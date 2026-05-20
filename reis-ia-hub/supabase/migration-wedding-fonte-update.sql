-- Migration: Update wedding_guests fonte check constraint
-- Add 'convite-padrinho' and 'convite-madrinha' as valid fonte values
-- Date: 2026-05-17

ALTER TABLE wedding_guests DROP CONSTRAINT wedding_guests_fonte_check;

ALTER TABLE wedding_guests ADD CONSTRAINT wedding_guests_fonte_check
  CHECK (fonte IN ('save-the-date','site','convite','convite-padrinho','convite-madrinha'));
