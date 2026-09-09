import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export type CouponCheck =
  | { valid: true; code: string; type: "percent" | "fixed"; value: number; discount: number }
  | { valid: false; error: string };

/** Looks up a code and computes the discount against a subtotal — used by
 *  both the checkout "Apply" button and the order-creation route, so a
 *  coupon is never trusted from the client, only ever recomputed here. */
export async function checkCoupon(rawCode: string, subtotal: number): Promise<CouponCheck> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, error: "Enter a code" };

  const { data: coupon } = await db.from("furniture_coupons").select("*").eq("code", code).single();
  if (!coupon || !coupon.active) return { valid: false, error: "Invalid coupon code" };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { valid: false, error: "This coupon has expired" };
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) return { valid: false, error: "This coupon has reached its usage limit" };

  const discount = coupon.type === "percent"
    ? Math.round(subtotal * (coupon.value / 100))
    : Math.min(coupon.value, subtotal);

  return { valid: true, code: coupon.code, type: coupon.type, value: coupon.value, discount };
}

/** Bumps used_count — call only after an order actually goes through. */
export async function markCouponUsed(code: string) {
  const { data } = await db.from("furniture_coupons").select("used_count").eq("code", code).single();
  if (data) {
    await db.from("furniture_coupons").update({ used_count: data.used_count + 1 }).eq("code", code);
  }
}
