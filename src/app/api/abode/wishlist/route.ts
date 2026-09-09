import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PUBLIC_FIELDS =
  "id, title, location, city, price, images, rating, review_count, available";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: saved, error } = await db
    .from("shortlet_wishlist")
    .select("shortlet_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (saved ?? []).map((s) => s.shortlet_id);
  if (ids.length === 0) return NextResponse.json([]);

  const { data: listings, error: listingsError } = await db
    .from("shortlets")
    .select(PUBLIC_FIELDS)
    .in("id", ids);
  if (listingsError) return NextResponse.json({ error: listingsError.message }, { status: 500 });

  const byId = new Map((listings ?? []).map((l) => [l.id, l]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  return NextResponse.json(ordered);
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const shortletId = String(body?.shortlet_id ?? "").trim();
  if (!shortletId) return NextResponse.json({ error: "shortlet_id is required" }, { status: 400 });

  const { error } = await db
    .from("shortlet_wishlist")
    .upsert({ user_id: user.id, shortlet_id: shortletId }, { onConflict: "user_id,shortlet_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const shortletId = searchParams.get("shortlet_id");
  if (!shortletId) return NextResponse.json({ error: "shortlet_id is required" }, { status: 400 });

  const { error } = await db
    .from("shortlet_wishlist")
    .delete()
    .eq("user_id", user.id)
    .eq("shortlet_id", shortletId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
