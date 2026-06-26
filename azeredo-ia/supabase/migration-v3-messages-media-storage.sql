-- ===========================================
-- AZEREDO IA — Migration v3
-- az_messages media fields + Storage bucket
-- ===========================================

-- Media + dedup fields on az_messages
alter table az_messages add column if not exists content_type text not null default 'text';
alter table az_messages add column if not exists media_url text;
alter table az_messages add column if not exists media_mime text;
alter table az_messages add column if not exists wa_message_id text;
alter table az_messages add column if not exists metadata jsonb;

create unique index if not exists az_messages_wa_id_unique
  on az_messages(wa_message_id)
  where wa_message_id is not null;

-- Storage bucket for WhatsApp media
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'az-media', 'az-media', true, 52428800,
  ARRAY[
    'image/jpeg','image/png','image/webp','image/gif',
    'audio/ogg','audio/mpeg','audio/mp4','audio/m4a',
    'video/mp4','video/quicktime',
    'application/pdf','application/octet-stream',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
) on conflict (id) do nothing;

-- Storage RLS: public read + auth upload (guard with DO to avoid duplicate errors)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read az-media'
  ) then
    execute 'create policy "Public read az-media" on storage.objects for select using (bucket_id = ''az-media'')';
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Auth upload az-media'
  ) then
    execute 'create policy "Auth upload az-media" on storage.objects for insert with check (bucket_id = ''az-media'' and auth.uid() is not null)';
  end if;
end $$;
