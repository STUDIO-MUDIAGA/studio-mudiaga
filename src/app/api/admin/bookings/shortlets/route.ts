import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function requireAdmin(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  if (!token) return false;
  const { data: { user } } = await db.auth.getUser(token);
  if (!user) return false;
  const { data } = await db.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin";
}

export async function GET(req: Request) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const shortlet_id = url.searchParams.get("shortlet_id");

  let q = db
    .from("shortlet_bookings")
    .select(`id, guest_name, guest_email, guest_phone, checkin, checkout, guests, nights,
             price_per_night, service_fee, total_amount, status, notes, created_at,
             shortlet:shortlets(id, title, city, images)`)
    .order("created_at", { ascending: false });

  if (status) q = q.eq("status", status);
  if (shortlet_id) q = q.eq("shortlet_id", shortlet_id);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
