import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const { data, error } = await db.from("furniture_coupons").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const code = String(body?.code ?? "").trim().toUpperCase();
  const type = body?.type === "fixed" ? "fixed" : "percent";
  const value = Number(body?.value);
  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });
  if (!Number.isFinite(value) || value <= 0) return NextResponse.json({ error: "Value must be a positive number" }, { status: 400 });

  const { error } = await db.from("furniture_coupons").insert({
    code,
    type,
    value,
    active: body?.active ?? true,
    max_uses: body?.max_uses ? Number(body.max_uses) : null,
    expires_at: body?.expires_at || null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
