-- Discount codes for MUDRES checkout. All access goes through Next.js API
-- routes with the service-role key — no public RLS policies, since exposing
-- every valid code via a client-side select would defeat the point.
create table if not exists public.furniture_coupons (
  code        text primary key,
  type        text not null check (type in ('percent', 'fixed')),
  value       numeric not null check (value > 0),
  active      boolean not null default true,
  max_uses    integer,
  used_count  integer not null default 0,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.furniture_coupons enable row level security;

-- The order itself records what discount (if any) applied.
alter table public.furniture_orders
  add column if not exists coupon_code text,
  add column if not exists discount numeric not null default 0;
