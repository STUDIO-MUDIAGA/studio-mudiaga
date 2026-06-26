import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { listFromCF, deleteFromCF, MediaPrefix } from "@/lib/cf-images";

export const runtime = "nodejs";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function requireAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  if (!token) return null;
  const { data: { user } } = await db.auth.getUser(token);
  if (!user) return null;
  const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

const VALID_PREFIXES: MediaPrefix[] = ["shortlets", "furniture", "homepage", "mudres", "abode"];

// GET /api/admin/media?prefix=homepage
export async function GET(req: NextRequest) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefix = req.nextUrl.searchParams.get("prefix") as MediaPrefix | null;
  const validPrefix = prefix && VALID_PREFIXES.includes(prefix) ? prefix : undefined;

  const objects = await listFromCF(validPrefix);
  return NextResponse.json(objects);
}

// DELETE /api/admin/media?key=homepage/abc.jpg
export async function DELETE(req: NextRequest) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });

  await deleteFromCF(key);
  return NextResponse.json({ ok: true });
}
