-- Run this in the Supabase SQL editor.
create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  github_url text,
  live_url text,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  attachment_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contacts add column if not exists is_read boolean not null default false;

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null
);

alter table public.projects enable row level security;
alter table public.contacts enable row level security;
alter table public.skills enable row level security;

-- Public read for portfolio display.
drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  using (true);

drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills"
  on public.skills for select
  using (true);

-- Public insert for contact form.
drop policy if exists "Public can create contacts" on public.contacts;
create policy "Public can create contacts"
  on public.contacts for insert
  with check (true);

-- Authenticated admin CRUD.
drop policy if exists "Authenticated manage projects" on public.projects;
create policy "Authenticated manage projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated manage contacts" on public.contacts;
create policy "Authenticated manage contacts"
  on public.contacts for select
  to authenticated
  using (true);

drop policy if exists "Authenticated update contacts" on public.contacts;
create policy "Authenticated update contacts"
  on public.contacts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete contacts" on public.contacts;
create policy "Authenticated delete contacts"
  on public.contacts for delete
  to authenticated
  using (true);

drop policy if exists "Authenticated manage skills" on public.skills;
create policy "Authenticated manage skills"
  on public.skills for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

drop policy if exists "Public can read project files" on storage.objects;
create policy "Public can read project files"
  on storage.objects for select
  using (bucket_id = 'project-files');

drop policy if exists "Authenticated upload project files" on storage.objects;
create policy "Authenticated upload project files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-files');
