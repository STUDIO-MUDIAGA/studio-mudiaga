import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

type IncomingLine = { id: string; quantity: number };

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

  // Price server-side from the catalogue. Anything the client sent about
  // money is ignored, so a tampered cart cannot set its own total.
  const ids = [...new Set(lines.map((l) => String(l.id)))];
  const { data: catalogue, error: catalogueError } = await db
    .from("furniture_items")
    .select("id, name, price, images, in_stock")
    .in("id", ids);

  if (catalogueError) {
    return NextResponse.json({ error: catalogueError.message }, { status: 500 });
  }

  const priced = [];
  for (const line of lines) {
    const item = catalogue?.find((c) => c.id === line.id);
    if (!item) {
      return NextResponse.json({ error: "A piece in your cart is no longer available" }, { status: 409 });
    }
    if (!item.in_stock) {
      return NextResponse.json({ error: `${item.name} is out of stock` }, { status: 409 });
    }
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(line.quantity) || 1)));
    priced.push({
      id: item.id,
      name: item.name,
      price: item.price ?? 0,
      image: item.images?.[0] ?? null,
      quantity,
      line_total: (item.price ?? 0) * quantity,
    });
  }

  const subtotal = priced.reduce((n, l) => n + l.line_total, 0);
  const paymentMethod = body.payment_method === "on_delivery" ? "on_delivery" : "transfer";

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
    total: subtotal + DELIVERY_FEE,
    payment_method: paymentMethod,
    payment_status: "unpaid",
    status: "pending",
  };

  const { error } = await db.from("furniture_orders").insert(order);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: order.id, total: order.total }, { status: 201 });
}
