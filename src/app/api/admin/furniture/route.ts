import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const { data, error } = await db
    .from("furniture_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = "f-" + Math.random().toString(36).slice(2, 9);
  const { error } = await db.from("furniture_items").insert({ ...body, id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id }, { status: 201 });
}
