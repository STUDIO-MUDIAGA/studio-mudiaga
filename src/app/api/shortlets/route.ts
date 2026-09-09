import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Public listing feed — the properties/[id] pages were calling the
 *  admin-gated /api/admin/shortlets endpoints directly, which the proxy
 *  middleware rejects for anyone signed out or not an admin (401/403). This
 *  is the storefront-facing equivalent, mirroring /api/furniture/[id]. */
export async function GET() {
  const { data, error } = await db
    .from("shortlets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
