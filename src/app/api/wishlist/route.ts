import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PUBLIC_FIELDS =
  "id, name, category, price, original_price, images, in_stock";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: saved, error } = await db
    .from("furniture_wishlist")
    .select("item_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (saved ?? []).map((s) => s.item_id);
  if (ids.length === 0) return NextResponse.json([]);

  const { data: items, error: itemsError } = await db
    .from("furniture_items")
    .select(PUBLIC_FIELDS)
    .in("id", ids);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  // Keep the saved order (most recently added first), not whatever order
  // Postgres happened to return the IN() match in.
  const byId = new Map((items ?? []).map((i) => [i.id, i]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  return NextResponse.json(ordered);
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const itemId = String(body?.item_id ?? "").trim();
  if (!itemId) return NextResponse.json({ error: "item_id is required" }, { status: 400 });

  const { error } = await db
    .from("furniture_wishlist")
    .upsert({ user_id: user.id, item_id: itemId }, { onConflict: "user_id,item_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("item_id");
  if (!itemId) return NextResponse.json({ error: "item_id is required" }, { status: 400 });

  const { error } = await db
    .from("furniture_wishlist")
    .delete()
    .eq("user_id", user.id)
    .eq("item_id", itemId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
