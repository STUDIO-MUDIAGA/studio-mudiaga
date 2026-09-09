-- Lightweight delivery tracking on furniture_orders. furniture_orders itself
-- predates migrations in this repo (created live in Supabase), so this only
-- adds columns rather than the whole table.
alter table public.furniture_orders
  add column if not exists courier text,
  add column if not exists tracking_number text;
