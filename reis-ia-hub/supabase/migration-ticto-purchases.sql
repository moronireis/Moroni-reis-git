-- Migration: ticto_purchases table
-- Date: 2026-04-29
-- Purpose: Store Ticto purchase records for verification during account creation.
-- The webhook inserts 'verified' records; the /api/auth/create-from-purchase endpoint
-- marks them 'used' after successful account creation.

CREATE TABLE IF NOT EXISTS ticto_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  name text,
  phone text,
  product_name text,
  order_id text,
  order_hash text,
  paid_amount numeric,
  utm_data jsonb DEFAULT '{}',
  status text DEFAULT 'verified' CHECK (status IN ('verified', 'used', 'refunded')),
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticto_purchases_email ON ticto_purchases(email);
CREATE INDEX IF NOT EXISTS idx_ticto_purchases_status ON ticto_purchases(status);
CREATE INDEX IF NOT EXISTS idx_ticto_purchases_email_status ON ticto_purchases(email, status);
