-- Bookings weren't linked to any account (guest_name/email/phone were
-- free-text only), so there was no way to build a "My Bookings" page. Booking
-- now requires sign-in (see /api/bookings/shortlets), so every new booking
-- gets a real user_id.

alter table public.shortlet_bookings
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists shortlet_bookings_user_id_idx
  on public.shortlet_bookings (user_id);

create policy "Users view their own bookings"
  on public.shortlet_bookings for select
  using (auth.uid() = user_id);
