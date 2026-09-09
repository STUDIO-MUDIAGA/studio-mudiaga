import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { checkShortletCoupon, markShortletCouponUsed } from "@/lib/shortlet-coupons";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

/** The signed-in customer's own bookings, most recent first, with just
 *  enough of the listing joined in for a dashboard list (title/image). */
export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: bookings, error } = await db
    .from("shortlet_bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const shortletIds = [...new Set((bookings ?? []).map((b) => b.shortlet_id))];
  const { data: listings } = shortletIds.length
    ? await db.from("shortlets").select("id, title, city, images").in("id", shortletIds)
    : { data: [] };
  const listingById = new Map((listings ?? []).map((l) => [l.id, l]));

  const withListing = (bookings ?? []).map((b) => ({
    ...b,
    shortlet: listingById.get(b.shortlet_id) ?? null,
  }));

  return NextResponse.json(withListing);
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to request a booking" }, { status: 401 });

  const body = await req.json();
  const { shortlet_id, guest_name, guest_email, guest_phone, checkin, checkout, guests, notes, coupon_code } = body;

  if (!shortlet_id || !guest_name || !guest_email || !checkin || !checkout || !guests) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Fetch shortlet for price
  const { data: shortlet, error: sErr } = await db
    .from("shortlets")
    .select("id, title, price, min_nights, available")
    .eq("id", shortlet_id)
    .single();

  if (sErr || !shortlet) return NextResponse.json({ error: "Property not found" }, { status: 404 });
  if (!shortlet.available) return NextResponse.json({ error: "Property is not available" }, { status: 409 });

  const nights = Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000);
  if (nights < (shortlet.min_nights ?? 1)) {
    return NextResponse.json({ error: `Minimum stay is ${shortlet.min_nights} night(s)` }, { status: 400 });
  }

  const price_per_night = shortlet.price;
  const service_fee = Math.round(price_per_night * nights * 0.05);
  const subtotal = price_per_night * nights + service_fee;

  // Never trust a client-submitted discount — re-derive it here, same as
  // the MUDRES checkout does for furniture_coupons.
  let discount = 0;
  let appliedCode: string | null = null;
  if (coupon_code) {
    const result = await checkShortletCoupon(coupon_code, subtotal);
    if (result.valid) {
      discount = result.discount;
      appliedCode = result.code;
    }
  }
  const total_amount = subtotal - discount;

  const { data, error } = await db.from("shortlet_bookings").insert({
    shortlet_id, guest_name, guest_email, guest_phone: guest_phone ?? "",
    checkin, checkout, guests, nights, price_per_night, service_fee, total_amount,
    status: "pending", notes: notes ?? "", user_id: user.id,
    coupon_code: appliedCode, discount,
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (appliedCode) await markShortletCouponUsed(appliedCode);

  return NextResponse.json({ id: data.id, total_amount, nights, discount }, { status: 201 });
}
