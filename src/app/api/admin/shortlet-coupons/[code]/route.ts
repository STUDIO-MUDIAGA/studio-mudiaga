import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function PUT(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.active === "boolean") patch.active = body.active;
  if (body.max_uses !== undefined) patch.max_uses = body.max_uses ? Number(body.max_uses) : null;
  if (body.expires_at !== undefined) patch.expires_at = body.expires_at || null;

  const { error } = await db.from("shortlet_coupons").update(patch).eq("code", decodeURIComponent(code).toUpperCase());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { error } = await db.from("shortlet_coupons").delete().eq("code", decodeURIComponent(code).toUpperCase());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
