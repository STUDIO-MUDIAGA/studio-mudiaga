-- Admin-curated "Product of the Month" spotlight for the MUDRES landing
-- page — separate from `featured` (which drives the mega menu and the
-- collection-preview grid) so the two can be set independently.
alter table public.furniture_items
  add column if not exists product_of_month boolean not null default false;
