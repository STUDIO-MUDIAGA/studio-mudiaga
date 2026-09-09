import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { DEFAULT_CATEGORY_ICON } from "@/lib/category-icons";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Same shape as the public endpoint, but includes every category even if
 *  no items currently sit in it (the admin needs to see it to edit it). */
export async function GET() {
  const [{ data: items, error }, { data: meta }] = await Promise.all([
    db.from("furniture_items").select("category"),
    db.from("furniture_category_meta").select("*").order("category"),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const metaMap = new Map((meta ?? []).map((m) => [m.category, m]));
  const fromItems = new Set((items ?? []).map((i) => i.category).filter(Boolean));
  const allCategories = new Set([...fromItems, ...metaMap.keys()]);

  const result = Array.from(allCategories).sort().map((category) => {
    const m = metaMap.get(category);
    return {
      category,
      icon: m?.icon ?? DEFAULT_CATEGORY_ICON,
      blurb: m?.blurb ?? "",
      itemCount: (items ?? []).filter((i) => i.category === category).length,
    };
  });

  return NextResponse.json(result);
}
