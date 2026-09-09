import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Called right after the Paystack popup closes with a success callback.
 *  The client-side callback alone isn't trustworthy — this re-checks the
 *  transaction against Paystack's API before marking anything paid. The
 *  webhook (api/webhooks/paystack) is the authoritative backstop in case
 *  the customer closes the tab before this ever runs. */
export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const orderId = String(body?.orderId ?? "").trim();
  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  const { data: order, error } = await db.from("furniture_orders").select("*").eq("id", orderId).single();
  if (error || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (order.payment_status === "paid") return NextResponse.json({ paid: true });

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Payments are not configured yet" }, { status: 500 });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const result = await res.json().catch(() => null);
  const tx = result?.data;

  const isValid =
    result?.status === true &&
    tx?.status === "success" &&
    tx?.amount === Math.round((order.total ?? 0) * 100);

  if (!isValid) {
    return NextResponse.json({ paid: false, error: "Payment could not be verified" }, { status: 402 });
  }

  await db.from("furniture_orders").update({
    payment_status: "paid",
    payment_reference: tx.reference,
    status: order.status === "pending" ? "confirmed" : order.status,
  }).eq("id", orderId);

  return NextResponse.json({ paid: true });
}
