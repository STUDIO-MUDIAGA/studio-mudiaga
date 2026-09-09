-- Admin-editable icon + blurb per furniture category, shown in the MUDRES
-- mega menu. All reads/writes go through Next.js API routes with the
-- service-role key, so no public RLS policies are needed here.
create table if not exists public.furniture_category_meta (
  category    text primary key,
  icon        text not null default 'LayoutGrid',
  blurb       text not null default '',
  updated_at  timestamptz not null default now()
);

alter table public.furniture_category_meta enable row level security;

-- Seed with what was previously hardcoded in MudresHeader.tsx, so nothing
-- changes visually until an admin edits an entry.
insert into public.furniture_category_meta (category, icon, blurb) values
  ('Seating', 'Sofa', 'Chairs, sofas and lounge pieces.'),
  ('Tables', 'Table2', 'Dining, coffee and side tables.'),
  ('Lighting', 'Lamp', 'Pendants, lamps and shades.'),
  ('Storage', 'Archive', 'Shelving, cabinets and consoles.'),
  ('Bedroom', 'BedDouble', 'Beds, frames and headboards.'),
  ('Decor', 'Flower2', 'Planters, ceramics and objects.')
on conflict (category) do nothing;
