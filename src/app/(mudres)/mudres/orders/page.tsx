"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const DARK = "#2A3812";
const INK = DARK;
const MUTED = "#6F7A5E";
const LINE = "#E7E8E0";
const SURFACE = "#F5F5F1";

type OrderLine = { id: string; name: string; price: number; image: string | null; quantity: number };
type Order = {
  id: string;
  items: OrderLine[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
};

const naira = (n: number) => `₦${(n ?? 0).toLocaleString()}`;

const STATUS_FILL: Record<string, string> = {
  pending: "#8a6d1f",
  confirmed: "#2f6b8f",
  shipped: "#3f6b3a",
  delivered: "#2f5f2a",
  cancelled: "#8f3a34",
};

export default function MudresOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    fetch("/api/orders")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? "Could not load orders");
        return r.json();
      })
      .then((data: Order[]) => live && setOrders(Array.isArray(data) ? data : []))
      .catch((e: Error) => live && (setError(e.message), setOrders([])));
    return () => {
      live = false;
    };
  }, []);

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: HEADER_SPACE + 16 }}>
    <div className="px-5 md:px-10 pt-8 pb-20" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ color: INK, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.03em" }}>
        Orders
      </h1>
      <p style={{ color: MUTED, fontSize: 13.5, margin: "0 0 28px" }}>
        Every piece you have ordered from MUDRES.
      </p>

      {orders === null && <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>}

      {orders !== null && orders.length === 0 && (
        <div style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 18, padding: "56px 24px", textAlign: "center" }}>
          <Package size={26} color="#A9B199" strokeWidth={1.5} />
          <p style={{ color: MUTED, fontSize: 13.5, margin: "14px 0 20px" }}>
            {error || "You have not placed an order yet."}
          </p>
          <Link
            href="/mudres/collection"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: DARK, color: "#fff",
              fontSize: 13, fontWeight: 600, padding: "11px 20px", borderRadius: 999, textDecoration: "none",
            }}
          >
            Browse the collection <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {orders?.map((order) => (
        <div
          key={order.id}
          style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 18, padding: 20, marginBottom: 14 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <p style={{ color: INK, fontSize: 14, fontWeight: 700, margin: "0 0 3px" }}>{order.id}</p>
              <p style={{ color: MUTED, fontSize: 12.5, margin: 0 }}>
                {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span
              style={{
                background: STATUS_FILL[order.status] ?? "#6a6a62", color: "#fff",
                fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "5px 11px", borderRadius: 999,
              }}
            >
              {order.status}
            </span>
          </div>

          {order.items?.map((line) => (
            <div key={line.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 46, height: 46, borderRadius: 10, overflow: "hidden", background: SURFACE, flex: "0 0 auto" }}>
                {line.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.image} alt={line.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
              <span style={{ color: INK, fontSize: 13.5, flex: 1, minWidth: 0 }}>
                {line.name} <span style={{ color: MUTED }}>x{line.quantity}</span>
              </span>
              <span style={{ color: INK, fontSize: 13.5, fontWeight: 600 }}>
                {naira(line.price * line.quantity)}
              </span>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ color: MUTED, fontSize: 12.5 }}>
              {order.payment_method === "on_delivery" ? "Pay on delivery" : "Bank transfer"} · {order.payment_status}
            </span>
            <span style={{ color: INK, fontSize: 16, fontWeight: 700 }}>{naira(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
