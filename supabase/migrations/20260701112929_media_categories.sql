-- media_categories — user-defined folders for the admin Media Library
create table if not exists public.media_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

-- Only the service-role key (used by the admin media API routes) reads/writes this
-- table; no policies are added so anon/authenticated roles have no access.
alter table public.media_categories enable row level security;
