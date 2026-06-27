-- ===========================================
-- AZEREDO IA — Migration v5
-- "u4digital" test brand for dispatch testing
-- ===========================================

-- A dedicated brand to tag internal/test recipients (the team's own numbers),
-- so test campaigns can be segmented to brand = "u4digital" without touching
-- real client contacts. Contacts are added via the "Novo contato" form in the
-- Contatos screen and tagged with this brand.
insert into az_brands (name, slug, inativo_recente_dias, inativo_antigo_dias) values
  ('u4digital', 'u4digital', 9999, 9999)
on conflict (slug) do nothing;
