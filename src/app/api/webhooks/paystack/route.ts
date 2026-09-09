import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Authoritative source of truth for payment confirmation — fires from
 *  Paystack's servers regardless of whether the customer's browser stays
 *  open. Configure this URL (https://studiomudiaga.com/api/webhooks/paystack)
 *  in the Paystack dashboard under Settings -> API Keys & Webhooks. */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Payments are not configured yet" }, { status: 500 });
  }

  const expected = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const tx = event.data;
    const reference = String(tx.reference ?? "");

    const { data: order } = await db
      .from("furniture_orders")
      .select("id, total, payment_status, status")
      .eq("id", reference)
      .single();

    if (order && order.payment_status !== "paid" && tx.amount === Math.round((order.total ?? 0) * 100)) {
      await db.from("furniture_orders").update({
        payment_status: "paid",
        payment_reference: reference,
        status: order.status === "pending" ? "confirmed" : order.status,
      }).eq("id", reference);
    }
  }

  return NextResponse.json({ received: true });
}
