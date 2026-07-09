-- ===========================================
-- AZEREDO IA — Migration v10
-- A1a (última compra / situação real) + M3 passo 1 (vendedor por cliente)
-- Fonte: relatório "Carteira detalhada de clientes" do Mercos, por representada
-- ===========================================

-- Dados por vínculo cliente×marca (cada carteira é de uma representada)
alter table az_contact_brands add column if not exists ultima_compra_at date;
alter table az_contact_brands add column if not exists dias_sem_comprar integer;
alter table az_contact_brands add column if not exists ciclo_medio_dias numeric;
alter table az_contact_brands add column if not exists situacao text
  check (situacao is null or situacao in ('ativo','inativo_recente','inativo_antigo'));
alter table az_contact_brands add column if not exists vendedor text;
alter table az_contact_brands add column if not exists valor_ultimo_pedido numeric;
alter table az_contact_brands add column if not exists ultimo_pedido_numero text;

-- Agregados no contato (status global = melhor situação entre as marcas;
-- vendedor_principal = vendedor do pedido mais recente — substitui o array
-- poluído az_contact_brands.vendedores como fonte para segmentação)
alter table az_contacts add column if not exists ultima_compra_at date;
alter table az_contacts add column if not exists vendedor_principal text;

create index if not exists idx_az_contacts_vendedor on az_contacts(vendedor_principal);
create index if not exists idx_az_cb_situacao on az_contact_brands(situacao);
