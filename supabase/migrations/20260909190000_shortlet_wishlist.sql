-- Saved listings for ABODE, mirroring furniture_wishlist. The property
-- detail page previously "saved" to localStorage only (abode_favourites) —
-- this replaces that with a real account-backed save so it follows the
-- user across devices and can be listed in the dashboard.

create table if not exists public.shortlet_wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  shortlet_id text not null references public.shortlets(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, shortlet_id)
);

alter table public.shortlet_wishlist enable row level security;

create policy "Users manage their own saved listings"
  on public.shortlet_wishlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
