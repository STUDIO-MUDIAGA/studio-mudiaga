import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { checkCoupon, markCouponUsed } from "@/lib/coupons";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

type IncomingLine = { id: string; quantity: number; color?: string };

const DELIVERY_FEE = 0; // Quoted by the studio after the order is reviewed.

/** The signed-in customer's own orders. */
export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await db
    .from("furniture_orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const lines: IncomingLine[] = Array.isArray(body.items) ? body.items : [];
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const required = ["full_name", "phone", "address", "city", "state"] as const;
  for (const field of required) {
    if (!String(body[field] ?? "").trim()) {
      return NextResponse.json({ error: `Missing ${field.replace("_", " ")}` }, { status: 400 });
    }
  }

  // Price server-side from the catalogue (and, where a color was picked,
  // from that color's variant row). Anything the client sent about money is
  // ignored, so a tampered cart cannot set its own total.
  const ids = [...new Set(lines.map((l) => String(l.id)))];
  const [{ data: catalogue, error: catalogueError }, { data: variants }] = await Promise.all([
    db.from("furniture_items").select("id, name, price, images, in_stock").in("id", ids),
    db.from("furniture_variants").select("item_id, color, price, in_stock").in("item_id", ids),
  ]);

  if (catalogueError) {
    return NextResponse.json({ error: catalogueError.message }, { status: 500 });
  }

  const priced = [];
  for (const line of lines) {
    const item = catalogue?.find((c) => c.id === line.id);
    if (!item) {
      return NextResponse.json({ error: "A piece in your cart is no longer available" }, { status: 409 });
    }

    const color = line.color ? String(line.color) : null;
    const variant = color ? variants?.find((v) => v.item_id === line.id && v.color === color) : null;
    const name = color ? `${item.name} (${color})` : item.name;
    const price = variant ? variant.price : item.price ?? 0;
    const inStock = variant ? variant.in_stock : item.in_stock;

    if (!inStock) {
      return NextResponse.json({ error: `${name} is out of stock` }, { status: 409 });
    }
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(line.quantity) || 1)));
    priced.push({
      id: item.id,
      name,
      price,
      image: item.images?.[0] ?? null,
      quantity,
      line_total: price * quantity,
    });
  }

  const subtotal = priced.reduce((n, l) => n + l.line_total, 0);
  const paymentMethod = body.payment_method === "on_delivery" ? "on_delivery" : "paystack";

  // Coupon is re-checked here, never trusted from the client — the discount
  // shown at "Apply" time is only a preview.
  let discount = 0;
  let couponCode: string | null = null;
  const rawCoupon = String(body.coupon_code ?? "").trim();
  if (rawCoupon) {
    const result = await checkCoupon(rawCoupon, subtotal);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    discount = result.discount;
    couponCode = result.code;
  }

  const order = {
    id: "fo-" + Math.random().toString(36).slice(2, 9),
    user_id: user.id,
    email: user.email ?? null,
    full_name: String(body.full_name).trim(),
    phone: String(body.phone).trim(),
    address: String(body.address).trim(),
    city: String(body.city).trim(),
    state: String(body.state).trim(),
    notes: String(body.notes ?? "").trim() || null,
    items: priced,
    subtotal,
    delivery_fee: DELIVERY_FEE,
    discount,
    coupon_code: couponCode,
    total: Math.max(0, subtotal + DELIVERY_FEE - discount),
    payment_method: paymentMethod,
    payment_status: "unpaid",
    status: "pending",
  };

  const { error } = await db.from("furniture_orders").insert(order);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (couponCode) await markCouponUsed(couponCode);

  return NextResponse.json({ id: order.id, total: order.total }, { status: 201 });
}
