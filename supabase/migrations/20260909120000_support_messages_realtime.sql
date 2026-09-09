-- Let admins read every thread (needed both for the admin inbox's service-role
-- API and, more importantly, for the admin browser's own Realtime subscription,
-- which is subject to RLS since it runs as the signed-in admin, not service role).
create policy "Admins can view all threads"
  on public.support_messages for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Enable Realtime so both the customer chat and the admin inbox update live
-- instead of requiring a manual refresh.
alter publication supabase_realtime add table public.support_messages;
