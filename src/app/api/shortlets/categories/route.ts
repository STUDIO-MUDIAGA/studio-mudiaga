import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Public read for the mega menu / properties filters — mirrors
 *  /api/admin/shortlets/categories but without the admin gate, same
 *  reasoning as /api/shortlets/route.ts. */
export async function GET() {
  const { data, error } = await db
    .from("shortlet_categories")
    .select("id, name, slug, description, color, icon, shortlet_category_map(shortlet_id)")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result = (data ?? []).map((c) => {
    const shortletIds = (c.shortlet_category_map as { shortlet_id: string }[] | null)?.map((m) => m.shortlet_id) ?? [];
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      color: c.color,
      icon: c.icon,
      property_count: shortletIds.length,
      shortlet_ids: shortletIds,
    };
  });

  return NextResponse.json(result);
}
