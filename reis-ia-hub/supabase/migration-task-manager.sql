-- ==========================================================================
-- REIS IA [HUB] — Task Manager (Calendar-style with client access)
-- Run in Supabase SQL Editor
-- ==========================================================================

-- ============================================================
-- 1. TABLE: task_manager
-- ============================================================
create table if not exists public.task_manager (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,

  -- Status with color coding:
  --   unlinked  = gray   (backlog, not yet scheduled)
  --   attention = yellow (needs attention)
  --   urgent    = red    (urgent)
  --   done      = green  (completed)
  status text not null default 'unlinked'
    check (status in ('unlinked', 'attention', 'urgent', 'done')),

  -- Owner type:
  --   client = task the client needs to do
  --   moroni = task Moroni will deliver
  owner_type text not null default 'client'
    check (owner_type in ('client', 'moroni')),

  -- Assignment
  assigned_to uuid references public.profiles(id) on delete set null,
  assigned_name text,
  created_by uuid references public.profiles(id) on delete set null,

  -- Scheduling (calendar placement)
  scheduled_date date,
  scheduled_time time,
  duration_minutes integer,

  -- Ordering within a day/column
  position integer not null default 0,

  -- Optional project grouping
  project_id uuid references public.projects(id) on delete set null,
  project_name text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast queries by date range
create index if not exists idx_task_manager_scheduled_date
  on public.task_manager(scheduled_date);

-- Index for user-specific queries
create index if not exists idx_task_manager_assigned_to
  on public.task_manager(assigned_to);

create index if not exists idx_task_manager_created_by
  on public.task_manager(created_by);

-- Index for status filtering
create index if not exists idx_task_manager_status
  on public.task_manager(status);

-- ============================================================
-- 2. RLS POLICIES
-- ============================================================
alter table public.task_manager enable row level security;

-- Admin (Moroni) can do everything
create policy "task_manager_admin_all" on public.task_manager
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Clients can read tasks assigned to them or created by them
create policy "task_manager_client_select" on public.task_manager
  for select
  using (
    assigned_to = auth.uid() or created_by = auth.uid()
  );

-- Clients can insert their own tasks (owner_type = 'client' only)
create policy "task_manager_client_insert" on public.task_manager
  for insert
  with check (
    created_by = auth.uid() and owner_type = 'client'
  );

-- Clients can update tasks they created or are assigned to
create policy "task_manager_client_update" on public.task_manager
  for update
  using (
    assigned_to = auth.uid() or created_by = auth.uid()
  )
  with check (
    assigned_to = auth.uid() or created_by = auth.uid()
  );

-- Only admin can delete
-- (no delete policy for non-admin — handled by the admin_all policy)

-- ============================================================
-- 3. ENABLE REALTIME
-- ============================================================
-- Enable realtime for the task_manager table
-- This allows all connected clients to receive live updates
alter publication supabase_realtime add table public.task_manager;

-- ============================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_task_manager_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger task_manager_updated_at
  before update on public.task_manager
  for each row execute procedure public.handle_task_manager_updated_at();
