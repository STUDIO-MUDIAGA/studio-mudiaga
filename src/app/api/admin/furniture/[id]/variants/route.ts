import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await db
    .from("furniture_variants")
    .select("*")
    .eq("item_id", id)
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

type IncomingVariant = { color: string; price: number; in_stock: boolean };

/** Full sync: whatever list is submitted becomes the item's complete variant
 *  set — upserts everything present, deletes anything left out. */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const variants: IncomingVariant[] = Array.isArray(body?.variants) ? body.variants : [];

  const cleaned = variants
    .map((v) => ({ color: String(v.color ?? "").trim(), price: Number(v.price), in_stock: !!v.in_stock }))
    .filter((v) => v.color && Number.isFinite(v.price) && v.price >= 0);

  const { data: existing } = await db.from("furniture_variants").select("color").eq("item_id", id);
  const keepColors = new Set(cleaned.map((v) => v.color));
  const toDelete = (existing ?? []).map((e) => e.color).filter((c) => !keepColors.has(c));

  if (toDelete.length > 0) {
    await db.from("furniture_variants").delete().eq("item_id", id).in("color", toDelete);
  }

  if (cleaned.length > 0) {
    const rows = cleaned.map((v, i) => ({ item_id: id, color: v.color, price: v.price, in_stock: v.in_stock, sort_order: i }));
    const { error } = await db.from("furniture_variants").upsert(rows, { onConflict: "item_id,color" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
