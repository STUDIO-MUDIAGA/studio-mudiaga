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

// PUT replaces all assignments for a category
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { shortlet_ids } = await req.json() as { shortlet_ids: string[] };

  await db.from("shortlet_category_map").delete().eq("category_id", id);

  if (shortlet_ids?.length) {
    const rows = shortlet_ids.map((sid) => ({ shortlet_id: sid, category_id: id }));
    const { error } = await db.from("shortlet_category_map").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
