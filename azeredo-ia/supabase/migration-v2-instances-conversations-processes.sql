-- ===========================================
-- AZEREDO IA — Migration v2
-- WhatsApp Instances + Conversations + Processes
-- ===========================================

-- WhatsApp instances (9 numbers)
create table if not exists az_whatsapp_instances (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  uazapi_name text not null,
  token text not null unique,
  phone_number text,
  status text not null default 'disconnected',
  qr_code text,
  slot_number integer not null,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table az_whatsapp_instances enable row level security;
create policy "Auth read instances" on az_whatsapp_instances for select using (auth.uid() is not null);
create policy "Admin write instances" on az_whatsapp_instances for all using (
  exists (select 1 from az_profiles where id = auth.uid() and role = 'admin')
);

-- Seed: 9 instances
insert into az_whatsapp_instances (uazapi_name, token, slot_number) values
  ('azeredo-ia',  'aec16f1a-b19f-40ea-8e44-8c4e5f6ade06', 1),
  ('azeredo-2',   '9908d81f-fb62-4057-9436-627c5e8abbcc',  2),
  ('azeredo-3',   '8c7a944f-f976-47d9-9558-9723cb87cf4f',  3),
  ('azeredo-4',   '449ea526-77bb-49be-87ad-ba23f00cbd7b',  4),
  ('azeredo-5',   '1c26de59-1ae1-42d1-9f0e-600f6c94f470',  5),
  ('azeredo-6',   'f3ebd40e-e0ee-479b-8e25-bebecffa569b',  6),
  ('azeredo-7',   '2130aa50-6f43-4355-88f5-0361f23dbe32',  7),
  ('azeredo-8',   '1509d238-7732-40fc-bdfc-c6cf23f2a877',  8),
  ('azeredo-9',   'd8757d50-fa8a-4c09-adca-e36a4b78b46f',  9)
on conflict (token) do nothing;

-- Conversations (inbox threads)
create table if not exists az_conversations (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid references az_whatsapp_instances(id) on delete cascade,
  contact_id uuid references az_contacts(id),
  remote_jid text not null,
  remote_name text,
  last_message text,
  last_message_at timestamptz,
  last_direction text default 'inbound',
  unread_count integer not null default 0,
  assigned_to uuid references az_profiles(id),
  status text not null default 'open' check (status in ('open','resolved')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(instance_id, remote_jid)
);
alter table az_conversations enable row level security;
create policy "Auth read conversations" on az_conversations for select using (auth.uid() is not null);
create policy "Auth write conversations" on az_conversations for all using (auth.uid() is not null);
create index if not exists idx_az_conv_instance on az_conversations(instance_id, last_message_at desc);
create index if not exists idx_az_conv_jid on az_conversations(remote_jid);
create index if not exists idx_az_conv_status on az_conversations(status);

-- Add columns to az_messages
alter table az_messages add column if not exists instance_id uuid references az_whatsapp_instances(id);
alter table az_messages add column if not exists conversation_id uuid references az_conversations(id);
alter table az_messages add column if not exists remote_jid text;

-- Processes & Standards (mini-CMS)
create table if not exists az_processes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  category text not null default 'Geral',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_by uuid references az_profiles(id),
  updated_by uuid references az_profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table az_processes enable row level security;
create policy "Auth read processes" on az_processes for select using (auth.uid() is not null);
create policy "Admin write processes" on az_processes for all using (
  exists (select 1 from az_profiles where id = auth.uid() and role = 'admin')
);

insert into az_processes (title, body, category, display_order) values
  ('Processo de Disparo em Massa',
   '1. Verificar se pelo menos um WhatsApp está conectado' || chr(10) ||
   '2. Selecionar template aprovado ou redigir mensagem' || chr(10) ||
   '3. Filtrar segmento correto (marca, cidade, status)' || chr(10) ||
   '4. Conferir contagem de destinatários antes de enviar' || chr(10) ||
   '5. Evitar disparos fora do horário comercial (8h–18h)',
   'Disparos', 1),
  ('Padrão de Atendimento WhatsApp',
   'Tempo máximo de resposta: 30 minutos em horário comercial.' || chr(10) ||
   'Sempre iniciar com saudação pelo nome do contato.' || chr(10) ||
   'Nunca prometer prazo de entrega sem confirmar com o comercial.' || chr(10) ||
   'Registrar acordos importantes no histórico do contato.',
   'Atendimento', 2),
  ('Processo de Reativação de Clientes',
   'Inativos recentes (30-60 dias): usar template Reativação diretamente.' || chr(10) ||
   'Inativos antigos (60+ dias): ligar antes de enviar mensagem.' || chr(10) ||
   'Nunca disparar para inativos sem validar se o telefone ainda está ativo.',
   'Vendas', 3)
on conflict do nothing;
