-- ===========================================
-- AZEREDO IA — Migration v4
-- Campaign sender number (which WhatsApp instance fires the blast)
-- ===========================================

-- Each campaign is now dispatched FROM a specific connected WhatsApp number.
-- Older campaigns keep instance_id NULL and fall back to the global token.
alter table az_campaigns
  add column if not exists instance_id uuid references az_whatsapp_instances(id);

create index if not exists idx_az_campaigns_instance on az_campaigns(instance_id);
