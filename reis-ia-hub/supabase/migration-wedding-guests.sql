-- ==========================================================================
-- WEDDING GUEST MANAGEMENT SYSTEM — Migration
-- Created: 2026-05-01
-- Tables: wedding_guests, wedding_companions, wedding_gifts
-- RLS: anon INSERT (public forms), service_role SELECT/UPDATE (admin)
-- ==========================================================================

-- ============================================================
-- 1. wedding_guests
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wedding_guests (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                  text NOT NULL,
  whatsapp              text NOT NULL,
  email                 text,
  interesse             text DEFAULT 'sim'
                          CHECK (interesse IN ('sim','talvez','nao')),
  restricoes_alimentares text,
  mensagem              text,
  fonte                 text DEFAULT 'save-the-date'
                          CHECK (fonte IN ('save-the-date','site','convite')),
  status                text DEFAULT 'pendente'
                          CHECK (status IN ('pendente','aprovado','convite_enviado','confirmado','recusado')),
  convite_link          text,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- ============================================================
-- 2. wedding_companions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wedding_companions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id   uuid REFERENCES public.wedding_guests(id) ON DELETE CASCADE,
  nome       text NOT NULL,
  idade      int,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. wedding_gifts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wedding_gifts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id   uuid REFERENCES public.wedding_guests(id) ON DELETE SET NULL,
  tipo       text DEFAULT 'pix'
               CHECK (tipo IN ('pix','presente','outro')),
  valor      decimal,
  descricao  text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 4. updated_at trigger for wedding_guests
-- (reuses update_updated_at() already defined in schema.sql)
-- ============================================================
CREATE TRIGGER update_wedding_guests_updated_at
  BEFORE UPDATE ON public.wedding_guests
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- ============================================================
-- 5. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_wedding_guests_whatsapp
  ON public.wedding_guests(whatsapp);

CREATE INDEX IF NOT EXISTS idx_wedding_guests_status
  ON public.wedding_guests(status);

CREATE INDEX IF NOT EXISTS idx_wedding_guests_created_at
  ON public.wedding_guests(created_at);

-- FK indexes
CREATE INDEX IF NOT EXISTS idx_wedding_companions_guest
  ON public.wedding_companions(guest_id);

CREATE INDEX IF NOT EXISTS idx_wedding_gifts_guest
  ON public.wedding_gifts(guest_id);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.wedding_guests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_gifts     ENABLE ROW LEVEL SECURITY;

-- wedding_guests: anon can INSERT (public save-the-date form)
CREATE POLICY "anon_insert_wedding_guests"
  ON public.wedding_guests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- wedding_guests: service_role can SELECT (admin panel)
CREATE POLICY "service_select_wedding_guests"
  ON public.wedding_guests
  FOR SELECT
  TO service_role
  USING (true);

-- wedding_guests: service_role can UPDATE (admin status management)
CREATE POLICY "service_update_wedding_guests"
  ON public.wedding_guests
  FOR UPDATE
  TO service_role
  USING (true);

-- wedding_companions: anon can INSERT (submitted with guest form)
CREATE POLICY "anon_insert_wedding_companions"
  ON public.wedding_companions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- wedding_companions: service_role can SELECT
CREATE POLICY "service_select_wedding_companions"
  ON public.wedding_companions
  FOR SELECT
  TO service_role
  USING (true);

-- wedding_companions: service_role can UPDATE
CREATE POLICY "service_update_wedding_companions"
  ON public.wedding_companions
  FOR UPDATE
  TO service_role
  USING (true);

-- wedding_gifts: anon can INSERT (gift registration from public page)
CREATE POLICY "anon_insert_wedding_gifts"
  ON public.wedding_gifts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- wedding_gifts: service_role can SELECT
CREATE POLICY "service_select_wedding_gifts"
  ON public.wedding_gifts
  FOR SELECT
  TO service_role
  USING (true);

-- wedding_gifts: service_role can UPDATE
CREATE POLICY "service_update_wedding_gifts"
  ON public.wedding_gifts
  FOR UPDATE
  TO service_role
  USING (true);

-- ==========================================================================
-- DOWN MIGRATION (run manually if rollback needed — requires orchestrator approval)
-- ==========================================================================
-- DROP TRIGGER IF EXISTS update_wedding_guests_updated_at ON public.wedding_guests;
-- DROP TABLE IF EXISTS public.wedding_gifts;
-- DROP TABLE IF EXISTS public.wedding_companions;
-- DROP TABLE IF EXISTS public.wedding_guests;
-- ==========================================================================
