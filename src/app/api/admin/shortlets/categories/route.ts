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

export async function GET(req: Request) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // categories + property count each
  const { data, error } = await db
    .from("shortlet_categories")
    .select("*, shortlet_category_map(shortlet_id)")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result = (data ?? []).map((c) => ({
    ...c,
    property_count: (c.shortlet_category_map as { shortlet_id: string }[])?.length ?? 0,
    shortlet_category_map: undefined,
  }));

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  if (!await requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, description, color, icon } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const { data, error } = await db
    .from("shortlet_categories")
    .insert({ name: name.trim(), slug, description: description ?? "", color: color ?? "#1e156d", icon: icon ?? "tag" })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
