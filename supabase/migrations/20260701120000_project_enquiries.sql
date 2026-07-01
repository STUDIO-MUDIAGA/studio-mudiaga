-- project_enquiries — "Start a Project" client onboarding questionnaire submissions
create table if not exists public.project_enquiries (
  id uuid primary key default gen_random_uuid(),

  -- Section 1 — About you
  full_name text not null,
  email text not null,
  phone text,
  location text,
  source text,

  -- Section 2 — Your project
  project_type text,
  project_type_other text,
  property_location text,
  space_size text,
  areas text[] default '{}',
  areas_other text,
  occupancy text,
  target_date text,

  -- Section 3 — Your vision
  feeling text,
  inspiration text,
  inspiration_images text[] default '{}',
  dislikes text,
  daily_life text,
  household text,

  -- Section 4 — Your budget
  budget text,
  budget_scope text,
  prior_experience text,

  -- Section 5 — Your expectations
  success_vision text,
  involvement text,
  important_context text,
  anything_else text,

  status text not null default 'new',
  created_at timestamptz default now()
);

-- Only the service-role key (used by the /api/enquiries routes) reads/writes this
-- table; no policies are added so anon/authenticated roles have no access.
alter table public.project_enquiries enable row level security;
