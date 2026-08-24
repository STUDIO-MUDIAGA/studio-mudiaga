-- projects — client-manageable interior design portfolio entries (shown on /projects and /projects/[slug])
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  eyebrow text not null default 'Interior Design',
  location text not null default 'Nigeria',
  hero_image text not null,
  intro text[] not null default '{}',
  facts jsonb not null default '[]',
  gallery jsonb not null default '[]',
  cta_label text not null default 'Enquire About a Project Like This',
  cta_href text not null default '/book-a-consultation',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Only the service-role key (used by the admin + public projects API routes) reads/writes this
-- table; no policies are added so anon/authenticated roles have no access.
alter table public.projects enable row level security;
