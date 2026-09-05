-- MUDRES customer dashboard: wishlist and a lightweight support thread.
-- furniture_items.id is text (app-generated "f-xxxxxxx"), not uuid, so the
-- wishlist FK follows that type.

create table if not exists public.furniture_wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  item_id     text not null references public.furniture_items(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, item_id)
);

alter table public.furniture_wishlist enable row level security;

create policy "Users manage their own wishlist"
  on public.furniture_wishlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- One thread per customer with the studio. `sender` distinguishes the two
-- sides; there is no separate admin inbox UI yet, so studio replies are
-- inserted directly (service role) until one is built.
create table if not exists public.support_messages (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  sender      text not null check (sender in ('customer', 'studio')),
  body        text not null,
  created_at  timestamptz not null default now()
);

alter table public.support_messages enable row level security;

create policy "Users view their own thread"
  on public.support_messages for select
  using (auth.uid() = user_id);

create policy "Users send messages on their own thread"
  on public.support_messages for insert
  with check (auth.uid() = user_id and sender = 'customer');

create index if not exists support_messages_user_id_created_at_idx
  on public.support_messages (user_id, created_at);
