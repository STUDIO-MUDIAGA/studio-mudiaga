import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isValidSlug } from "@/lib/media-categories";
import { RESERVED_PROJECT_SLUGS } from "@/lib/projects";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await db.from("projects").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  if (body.slug !== undefined) {
    if (!isValidSlug(body.slug)) {
      return NextResponse.json({ error: "Slug must be lowercase letters, numbers, and hyphens only" }, { status: 400 });
    }
    if (RESERVED_PROJECT_SLUGS.includes(body.slug)) {
      return NextResponse.json({ error: `"${body.slug}" is reserved and can't be used as a project slug` }, { status: 400 });
    }
  }

  const { error } = await db.from("projects").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) {
    const message = error.code === "23505" ? "A project with this slug already exists" : error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await db.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
