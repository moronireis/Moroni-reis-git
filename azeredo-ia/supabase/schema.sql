-- Azeredo IA — CRM de Disparos WhatsApp
-- Prefix: az_

-- Profiles (users)
create table if not exists az_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'operador' check (role in ('admin', 'operador')),
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table az_profiles enable row level security;
create policy "Users see own profile" on az_profiles for select using (auth.uid() = id);
create policy "Admin sees all" on az_profiles for all using (
  exists (select 1 from az_profiles where id = auth.uid() and role = 'admin')
);

-- Brands (25 represented brands)
create table if not exists az_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique,
  inativo_recente_dias integer not null default 90,
  inativo_antigo_dias integer not null default 180,
  is_active boolean not null default true,
  created_at timestamptz default now()
);
alter table az_brands enable row level security;
create policy "Anyone can read brands" on az_brands for select using (true);
create policy "Admin manages brands" on az_brands for all using (
  exists (select 1 from az_profiles where id = auth.uid() and role = 'admin')
);

-- Contacts (deduplicated by CNPJ)
create table if not exists az_contacts (
  id uuid primary key default gen_random_uuid(),
  razao_social text not null,
  nome_fantasia text,
  cnpj text unique,
  phone_primary text,
  phones text[] default '{}',
  email text,
  endereco text,
  cidade text,
  estado text default 'RS',
  contato text,
  segmento text,
  status text not null default 'ativo' check (status in ('ativo', 'inativo_recente', 'inativo_antigo')),
  source text default 'import',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table az_contacts enable row level security;
create policy "Authenticated users read contacts" on az_contacts for select using (auth.uid() is not null);
create policy "Authenticated users write contacts" on az_contacts for all using (auth.uid() is not null);
create index if not exists idx_az_contacts_cnpj on az_contacts(cnpj);
create index if not exists idx_az_contacts_cidade on az_contacts(cidade);
create index if not exists idx_az_contacts_segmento on az_contacts(segmento);
create index if not exists idx_az_contacts_status on az_contacts(status);
create index if not exists idx_az_contacts_search on az_contacts using gin(to_tsvector('portuguese', coalesce(razao_social,'') || ' ' || coalesce(nome_fantasia,'')));

-- Contact <-> Brand (M:N)
create table if not exists az_contact_brands (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references az_contacts(id) on delete cascade,
  brand_id uuid not null references az_brands(id) on delete cascade,
  vendedores text[] default '{}',
  created_at timestamptz default now(),
  unique(contact_id, brand_id)
);
alter table az_contact_brands enable row level security;
create policy "Authenticated users read contact_brands" on az_contact_brands for select using (auth.uid() is not null);
create policy "Authenticated users write contact_brands" on az_contact_brands for all using (auth.uid() is not null);
create index if not exists idx_az_cb_contact on az_contact_brands(contact_id);
create index if not exists idx_az_cb_brand on az_contact_brands(brand_id);

-- Message templates
create table if not exists az_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  body text not null,
  category text default 'geral',
  created_by uuid references az_profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table az_templates enable row level security;
create policy "Authenticated read templates" on az_templates for select using (auth.uid() is not null);
create policy "Authenticated write templates" on az_templates for all using (auth.uid() is not null);

-- Campaigns
create table if not exists az_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  template_id uuid references az_templates(id),
  custom_body text,
  segment_filter jsonb default '{}',
  status text not null default 'draft' check (status in ('draft','sending','completed','cancelled','error')),
  total_count integer default 0,
  sent_count integer default 0,
  delivered_count integer default 0,
  failed_count integer default 0,
  created_by uuid references az_profiles(id),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table az_campaigns enable row level security;
create policy "Authenticated read campaigns" on az_campaigns for select using (auth.uid() is not null);
create policy "Authenticated write campaigns" on az_campaigns for all using (auth.uid() is not null);

-- Campaign recipients (delivery tracking)
create table if not exists az_campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references az_campaigns(id) on delete cascade,
  contact_id uuid references az_contacts(id),
  phone text not null,
  contact_name text,
  status text not null default 'pending' check (status in ('pending','sent','delivered','read','failed','skipped')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz default now()
);
alter table az_campaign_recipients enable row level security;
create policy "Authenticated read recipients" on az_campaign_recipients for select using (auth.uid() is not null);
create policy "Authenticated write recipients" on az_campaign_recipients for all using (auth.uid() is not null);
create index if not exists idx_az_recipients_campaign on az_campaign_recipients(campaign_id, status);

-- Messages log
create table if not exists az_messages (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references az_contacts(id),
  campaign_id uuid references az_campaigns(id),
  phone text not null,
  direction text not null default 'outbound' check (direction in ('outbound','inbound')),
  body text,
  wa_message_id text,
  status text default 'sent',
  sent_by uuid references az_profiles(id),
  created_at timestamptz default now()
);
alter table az_messages enable row level security;
create policy "Authenticated read messages" on az_messages for select using (auth.uid() is not null);
create policy "Authenticated write messages" on az_messages for all using (auth.uid() is not null);
create index if not exists idx_az_messages_phone on az_messages(phone, created_at desc);
create index if not exists idx_az_messages_campaign on az_messages(campaign_id);

-- Settings (key-value)
create table if not exists az_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
alter table az_settings enable row level security;
create policy "Authenticated read settings" on az_settings for select using (auth.uid() is not null);
create policy "Admin write settings" on az_settings for all using (
  exists (select 1 from az_profiles where id = auth.uid() and role = 'admin')
);

-- Default settings
insert into az_settings (key, value) values
  ('blast_delay_ms', '2000'),
  ('max_daily_messages', '500'),
  ('whatsapp', '{"status": "disconnected"}')
on conflict (key) do nothing;
