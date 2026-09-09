import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { checkShortletCoupon } from "@/lib/shortlet-coupons";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const code = String(body?.code ?? "");
  const subtotal = Number(body?.subtotal ?? 0);
  if (!code || !Number.isFinite(subtotal) || subtotal <= 0) {
    return NextResponse.json({ valid: false, error: "Invalid request" }, { status: 400 });
  }

  const result = await checkShortletCoupon(code, subtotal);
  return NextResponse.json(result);
}
