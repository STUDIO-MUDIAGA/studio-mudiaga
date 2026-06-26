import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function POST(req: Request) {
  const body = await req.json();
  const { shortlet_id, guest_name, guest_email, guest_phone, checkin, checkout, guests, notes } = body;

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
  const total_amount = price_per_night * nights + service_fee;

  const { data, error } = await db.from("shortlet_bookings").insert({
    shortlet_id, guest_name, guest_email, guest_phone: guest_phone ?? "",
    checkin, checkout, guests, nights, price_per_night, service_fee, total_amount,
    status: "pending", notes: notes ?? "",
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id, total_amount, nights }, { status: 201 });
}
