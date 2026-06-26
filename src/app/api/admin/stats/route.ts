import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const [{ count: users }, { count: bookings }, { count: orders }] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("bookings").select("*", { count: "exact", head: true }),
    db.from("orders").select("*", { count: "exact", head: true }),
  ]);

  return NextResponse.json({ users: users ?? 0, bookings: bookings ?? 0, orders: orders ?? 0 });
}
