import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Public catalogue. Read-only, no admin session required.
export async function GET() {
  const { data, error } = await db
    .from("furniture_items")
    .select("id, name, category, price, original_price, images, description, dimensions, material, colors, in_stock, featured, tags")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
