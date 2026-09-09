import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function PUT(req: Request, { params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const body = await req.json().catch(() => null);
  const icon = String(body?.icon ?? "").trim();
  const blurb = String(body?.blurb ?? "").trim();
  if (!icon) return NextResponse.json({ error: "Icon is required" }, { status: 400 });

  const { error } = await db
    .from("furniture_category_meta")
    .upsert({ category: decodeURIComponent(category), icon, blurb, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
