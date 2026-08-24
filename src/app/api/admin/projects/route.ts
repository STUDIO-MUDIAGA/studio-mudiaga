import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isValidSlug } from "@/lib/media-categories";
import { RESERVED_PROJECT_SLUGS } from "@/lib/projects";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  const { data, error } = await db
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const slug = String(body.slug ?? "");

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Slug must be lowercase letters, numbers, and hyphens only" }, { status: 400 });
  }
  if (RESERVED_PROJECT_SLUGS.includes(slug)) {
    return NextResponse.json({ error: `"${slug}" is reserved and can't be used as a project slug` }, { status: 400 });
  }

  const { data, error } = await db.from("projects").insert(body).select("id").single();
  if (error) {
    const message = error.code === "23505" ? "A project with this slug already exists" : error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ id: data.id }, { status: 201 });
}
