-- Per-color price/stock variants. An item with no rows here just uses its
-- own colors[]/price as before (fully backward compatible) — variants only
-- take over once an admin actually sets prices per color for that item.
create table if not exists public.furniture_variants (
  id          uuid primary key default gen_random_uuid(),
  item_id     text not null references public.furniture_items(id) on delete cascade,
  color       text not null,
  price       numeric not null,
  in_stock    boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  unique (item_id, color)
);

alter table public.furniture_variants enable row level security;

create policy "Public can view variants"
  on public.furniture_variants for select
  using (true);
