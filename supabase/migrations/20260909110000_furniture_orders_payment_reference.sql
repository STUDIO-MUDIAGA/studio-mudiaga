-- Stores the Paystack transaction reference for reconciliation/lookup.
alter table public.furniture_orders
  add column if not exists payment_reference text;
