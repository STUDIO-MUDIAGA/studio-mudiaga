import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { DEFAULT_CATEGORY_ICON } from "@/lib/category-icons";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Every category currently represented in the catalogue, with its
 *  admin-set icon/blurb where one exists (generic defaults otherwise). */
export async function GET() {
  const [{ data: items, error }, { data: meta }] = await Promise.all([
    db.from("furniture_items").select("category"),
    db.from("furniture_category_meta").select("*"),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const metaMap = new Map((meta ?? []).map((m) => [m.category, m]));
  const categories = Array.from(new Set((items ?? []).map((i) => i.category).filter(Boolean)));

  const result = categories.map((category) => {
    const m = metaMap.get(category);
    return {
      category,
      icon: m?.icon ?? DEFAULT_CATEGORY_ICON,
      blurb: m?.blurb ?? "Browse this category.",
    };
  });

  return NextResponse.json(result);
}
