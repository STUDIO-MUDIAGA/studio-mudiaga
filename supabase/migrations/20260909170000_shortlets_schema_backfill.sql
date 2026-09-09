-- Backfill migration: the shortlets/, shortlet_bookings, shortlet_categories,
-- shortlet_category_map, and shortlet_reviews tables already exist live in
-- Supabase (created ad hoc, not through a tracked migration), so a fresh
-- environment provisioned from this migrations folder would be missing all
-- five. This file captures the live schema as-is via `create table if not
-- exists` — it is a no-op against the current database and exists purely to
-- close that drift gap before further schema changes (see the following
-- migration, which adds shortlet_bookings.user_id).

create table if not exists public.shortlets (
  id            text primary key,
  title         text not null,
  location      text not null,
  city          text not null,
  price         integer not null,
  currency      text not null default 'NGN',
  rating        numeric default 0,
  review_count  integer default 0,
  images        text[] default '{}',
  bedrooms      integer default 1,
  bathrooms     integer default 1,
  guests        integer default 2,
  amenities     text[] default '{}',
  host          jsonb default '{}',
  available     boolean default true,
  tags          text[] default '{}',
  property_type text default 'Apartment',
  description   text default '',
  checkin       text default '14:00',
  checkout      text default '11:00',
  min_nights    integer default 1,
  rules         text[] default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.shortlets enable row level security;

drop policy if exists "Public can view shortlets" on public.shortlets;
create policy "Public can view shortlets"
  on public.shortlets for select
  using (true);

create table if not exists public.shortlet_bookings (
  id               uuid primary key default gen_random_uuid(),
  shortlet_id      text not null references public.shortlets(id) on delete cascade,
  guest_name       text not null,
  guest_email      text not null,
  guest_phone      text default '',
  checkin          date not null,
  checkout         date not null,
  guests           integer not null default 1,
  nights           integer not null default 1,
  price_per_night  integer not null,
  service_fee      integer not null default 0,
  total_amount     integer not null,
  status           text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  notes            text default '',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.shortlet_bookings enable row level security;

create table if not exists public.shortlet_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text default '',
  color       text default '#1e156d',
  icon        text default 'tag',
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

alter table public.shortlet_categories enable row level security;

create table if not exists public.shortlet_category_map (
  shortlet_id  text not null references public.shortlets(id) on delete cascade,
  category_id  uuid not null references public.shortlet_categories(id) on delete cascade,
  primary key (shortlet_id, category_id)
);

alter table public.shortlet_category_map enable row level security;

create table if not exists public.shortlet_reviews (
  id          uuid primary key default gen_random_uuid(),
  shortlet_id text not null references public.shortlets(id) on delete cascade,
  reviewer    text not null,
  rating      integer not null check (rating >= 1 and rating <= 5),
  comment     text not null,
  stay_date   text not null,
  created_at  timestamptz default now()
);

alter table public.shortlet_reviews enable row level security;
