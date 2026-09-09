# Studio Mudiaga — Build Log

Running reference of what's been built across the MUDRES (furniture) and ABODE
(shortlets) verticals, so future work can pick up context quickly. Updated as
major features land — not a line-by-line changelog (see `git log` for that).

---

## MUDRES — Furniture Store

### Customer-facing
- Storefront: landing page (hero, category grid, brand statement, collection
  preview, product of the month, how it works, trust strip, custom-orders
  CTA, FAQ teaser, newsletter signup), shop/collection page with sidebar
  filters + sort + pagination, product detail page with per-color variants.
- Branded auth (`MudresAuthForm`) at `/mudres/login` and `/mudres/signup`,
  separate from the site's generic auth.
- Cart (`src/lib/cart.ts`) — lines keyed by `(id, color)` so different colors
  of the same item price independently.
- Checkout: billing/shipping form, coupon apply, Paystack inline popup
  payment with server-side verification + webhook backstop
  (`/api/payments/paystack/verify`, `/api/webhooks/paystack`).
  **Paystack keys are still not set in `.env.local`** — flow is built but
  non-functional until `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
  are filled in and the webhook URL is registered in the Paystack dashboard.
- Customer dashboard (`(mudres-dashboard)` route group, `DashboardShell`):
  Home, Orders (with "complete payment" for unpaid Paystack orders),
  Wishlist, Chat with us (live via Supabase Realtime), Settings, avatar
  dropdown with sign-out.
- Policy pages: `/mudres/shipping`, `/mudres/returns`, `/mudres/faq`,
  `/mudres/size-guide` — skeletons, no invented policy copy.

### Admin backend (`/admin/furniture/*`)
- Item CRUD with per-color variant pricing/stock (`furniture_variants`),
  images via shared `ImagesField`/`MediaPicker` (R2 upload or pick existing).
- Orders: list, detail page, invoice, delivery courier/tracking fields,
  Paystack payment reference.
- Coupons (`furniture_coupons`) — percent/fixed, max uses, expiry.
- Categories: admin-editable icon + blurb for the storefront mega menu
  (`furniture_category_meta`, `src/lib/category-icons.ts`).
- Support inbox — real-time, admin ↔ customer chat.
- Sales metrics (real, not simulated).
- "Product of the Month" flag surfaces on the landing page.

### Data model additions
- `furniture_variants`, `furniture_wishlist`, `furniture_coupons`,
  `furniture_category_meta`, `support_messages` (generic, reused by ABODE),
  plus `furniture_orders.coupon_code` / `.discount` /
  `.payment_reference` / delivery fields.

---

## ABODE — Shortlet Booking

### Customer-facing
- Landing page, properties listing (search, city, beds, category filters),
  property detail page (gallery, amenities, reviews, host, booking card).
- Header (`AbodeHeader.tsx`) has a **mega menu** on "Properties" — a
  top-rated spotlight listing + the 8 seeded categories
  (`shortlet_categories`, icon+color already set) — reskinned light/orange,
  not a copy of MUDRES's dark pill chrome. Compact/hamburger mode with a
  slide-down drawer below 860px.
- Booking requires sign-in (redirects to `/login?next=...`), prefills name/
  email from the profile. Model is **request-then-confirm** — no charge at
  booking time; admin reviews and confirms, payment collected separately.
  (Deliberately not pay-at-booking like MUDRES — confirmed with the user.)
- Coupon codes in the booking modal, server-side re-validated
  (`shortlet_coupons`, mirrors the furniture coupon system).
- Saved listings (real account-backed wishlist, `shortlet_wishlist`) —
  replaced an earlier localStorage-only version.
- Customer dashboard at `/account` (`AbodeDashboardShell`, reuses the
  `(portal)` route group rather than a new `/abode/dashboard` tree since
  `/account` was already the established entry point): Home, My Bookings
  (cancel while pending), Saved listings, Chat with us (reuses the generic
  `support_messages` backend), Settings, avatar dropdown with sign-out.
- Google sign-in removed from `/login` and `/signup` (shared with the rest
  of the site) — MUDRES's auth form had already dropped it.

### Admin backend (`/admin/shortlets/*`)
- Listing CRUD, metrics, categories (name/description/color — no icon
  picker yet, icons are seeded directly in the DB).
- Bookings: flat list with a full detail drawer (guest info, stay details,
  pricing, notes, confirm/cancel) — functionally equivalent to a dedicated
  detail page, just a slide-over instead of a route.
- Coupons (`/admin/shortlets/coupons`).
- Support inbox and the customer list (`/admin/users`) are now visible in
  the ABODE workspace nav — both are cross-vertical/shared, so no new
  backend was needed, just the nav wiring. The customer list shows booking
  count/spend alongside MUDRES order count/spend for every person.
- Removed three dead top-level nav links (`/admin/bookings`, `/admin/orders`,
  `/admin/analytics`) that never had routes behind them.

### Data model additions
- Backfilled a migration for the whole shortlets schema (`shortlets`,
  `shortlet_bookings`, `shortlet_categories`, `shortlet_category_map`,
  `shortlet_reviews`) — these existed live in Supabase but were never
  tracked in `supabase/migrations/`, unlike every `furniture_*` table.
- `shortlet_bookings.user_id` (booking now requires an account),
  `.coupon_code` / `.discount`.
- `shortlet_wishlist`, `shortlet_coupons`.

### Bugs found and fixed along the way
- The properties listing, property detail, and ABODE landing pages were all
  calling the **admin-gated** `/api/admin/shortlets` endpoints directly —
  the proxy middleware rejects those for anyone not signed in as an admin,
  meaning no real customer could ever browse listings. Added public
  `/api/shortlets` + `/api/shortlets/[id]` + `/api/shortlets/categories`
  (mirrors the `/api/furniture/[id]` split) and repointed the customer
  pages.
- Mobile responsiveness: ABODE had no mobile handling anywhere (no header
  compact mode, several fixed-pixel grid layouts). Fixed across the whole
  customer site — header/drawer, landing page, listings, property detail
  (including a subtler bug where a `repeat(2,1fr)` review-card grid looked
  responsive but wasn't, because an unshrinkable header row forced the
  track wider than the viewport), booking modal, footer. Verified via
  Playwright at 390px: zero horizontal overflow everywhere.

---

## Shared / cross-cutting

- Auth: single generic `/login` + `/signup` (Google removed from both) used
  by ABODE and the general portal; MUDRES keeps its own branded pair.
  `profiles` table (`role: admin | customer`) is shared across verticals.
- `support_messages` — one thread per customer account, not vertical-scoped;
  reused as-is for both MUDRES and ABODE.
- Admin shell: three-workspace switcher (Main / MUDRES / ABODE), each with
  its own trimmed sidebar nav; global Cmd+K search.
- "Never trust the client for money" — order/booking pricing and coupon
  discounts are always re-derived server-side, never accepted from the
  client payload, consistently across both verticals.

## Known gaps / open items

- Paystack keys not in `.env.local` — MUDRES checkout payment is built but
  can't actually charge yet; webhook URL also not registered with Paystack.
- ABODE booking is intentionally request-then-confirm, no online payment —
  revisit if that should change later.
- ABODE "How it works" page doesn't exist (was previously linked, then
  removed from nav since it 404'd — worth building real content given the
  request-then-confirm model is easy to misread as "instant booking").
- `shortlet_categories` has no icon picker in the admin UI — icons were
  seeded directly against the DB (kebab-case, `src/lib/shortlet-category-icons.ts`).
- Guest checkout (order/booking without an account, prompting account
  creation after) was discussed but not built for either vertical.
- No customer-submitted reviews UI for ABODE (`shortlet_reviews` is
  admin/seed-populated only) — matches MUDRES, which also has no review
  submission flow.
