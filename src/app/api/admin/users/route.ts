import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const [{ data: profiles, error }, { data: orders }, { data: wishlist }] = await Promise.all([
    db.from("profiles").select("id, full_name, email, avatar_url, created_at").eq("role", "customer").order("created_at", { ascending: false }),
    db.from("furniture_orders").select("user_id, total, status"),
    db.from("furniture_wishlist").select("user_id"),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const orderStats = new Map<string, { count: number; spent: number }>();
  for (const o of orders ?? []) {
    const s = orderStats.get(o.user_id) ?? { count: 0, spent: 0 };
    s.count += 1;
    if (o.status !== "cancelled") s.spent += o.total ?? 0;
    orderStats.set(o.user_id, s);
  }

  const wishlistCounts = new Map<string, number>();
  for (const w of wishlist ?? []) {
    wishlistCounts.set(w.user_id, (wishlistCounts.get(w.user_id) ?? 0) + 1);
  }

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    email: p.email,
    avatar_url: p.avatar_url,
    created_at: p.created_at,
    order_count: orderStats.get(p.id)?.count ?? 0,
    total_spent: orderStats.get(p.id)?.spent ?? 0,
    wishlist_count: wishlistCounts.get(p.id) ?? 0,
  }));

  return NextResponse.json(users);
}
