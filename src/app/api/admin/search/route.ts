import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function requireAdmin(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  if (!token) return false;
  const { data: { user } } = await db.auth.getUser(token);
  if (!user) return false;
  const { data } = await db.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin";
}

type SearchResult = { type: string; id: string; title: string; subtitle: string; href: string };

const LIMIT = 6;

export async function GET(req: Request) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const raw = url.searchParams.get("q")?.trim() ?? "";
  const scope = url.searchParams.get("scope") ?? "all";

  if (raw.length < 2) return NextResponse.json({ results: [] });

  // Commas/parens are structural in PostgREST's ilike patterns — strip them
  // rather than let a stray character in someone's search break the match.
  const safe = raw.replace(/[,()%_]/g, " ").trim();
  if (!safe) return NextResponse.json({ results: [] });
  const like = `%${safe}%`;

  const results: SearchResult[] = [];

  if (scope === "mudres" || scope === "all") {
    const { data } = await db
      .from("furniture_items")
      .select("id, name, category")
      .ilike("name", like)
      .limit(LIMIT);
    for (const item of data ?? []) {
      results.push({ type: "Furniture", id: item.id, title: item.name, subtitle: item.category ?? "", href: `/admin/furniture/${item.id}/edit` });
    }
  }

  if (scope === "abode" || scope === "all") {
    const { data } = await db
      .from("shortlets")
      .select("id, title, location")
      .ilike("title", like)
      .limit(LIMIT);
    for (const item of data ?? []) {
      results.push({ type: "Shortlet", id: item.id, title: item.title, subtitle: item.location ?? "", href: `/admin/shortlets/${item.id}/edit` });
    }
  }

  if (scope === "all") {
    const { data: projects } = await db
      .from("projects")
      .select("id, title, slug")
      .ilike("title", like)
      .limit(LIMIT);
    for (const item of projects ?? []) {
      results.push({ type: "Project", id: item.id, title: item.title, subtitle: item.slug ?? "", href: `/admin/projects/${item.id}/edit` });
    }

    const { data: enquiries } = await db
      .from("project_enquiries")
      .select("id, full_name, email")
      .ilike("full_name", like)
      .limit(LIMIT);
    for (const item of enquiries ?? []) {
      results.push({ type: "Enquiry", id: item.id, title: item.full_name, subtitle: item.email, href: `/admin/enquiries` });
    }
  }

  return NextResponse.json({ results });
}
