"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Package, MapPin, CreditCard, Truck, User } from "lucide-react";

type OrderLine = { id: string; name: string; price: number; image: string | null; quantity: number; line_total: number };
type Order = {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string | null;
  items: OrderLine[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "paystack" | "on_delivery";
  payment_status: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  courier: string | null;
  tracking_number: string | null;
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const fmt = (n: number) => "₦" + (n ?? 0).toLocaleString("en-NG");
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

function Card({ title, icon: Icon, children }: { title: string; icon: typeof Package; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon size={15} color="#1e156d" />
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e156d" }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");
  const [saved, setSaved] = useState(false);

  const load = () => {
    fetch(`/api/admin/orders/furniture/${id}`)
      .then((r) => r.json())
      .then((d: Order) => {
        setOrder(d);
        setCourier(d.courier ?? "");
        setTracking(d.tracking_number ?? "");
        setLoading(false);
      });
  };

  useEffect(load, [id]);

  const patch = async (body: Record<string, unknown>) => {
    setSaving(true);
    await fetch(`/api/admin/orders/furniture/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    load();
  };

  const saveDelivery = async () => {
    await patch({ courier: courier.trim() || null, tracking_number: tracking.trim() || null });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#aaa", fontSize: 14 }}>Loading order…</div>;
  if (!order) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#aaa", fontSize: 14 }}>Order not found.</div>;

  return (
    <div style={{ padding: "32px 28px", minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <Link href="/admin/furniture/orders" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#888", fontSize: 12, textDecoration: "none", marginBottom: 8 }}>
            <ArrowLeft size={13} /> Back to orders
          </Link>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#1e156d", margin: 0, fontFamily: "monospace" }}>{order.id}</p>
          <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>Placed {fmtDate(order.created_at)}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <select
            value={order.status}
            disabled={saving}
            onChange={(e) => patch({ status: e.target.value })}
            style={{ fontSize: 13, padding: "9px 14px", border: "1px solid #ddd", borderRadius: 9, color: "#333", cursor: "pointer", textTransform: "capitalize" }}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Link
            href={`/admin/furniture/orders/${order.id}/invoice`}
            target="_blank"
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#1e156d", color: "#fff", padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            <Printer size={14} /> Invoice
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Items" icon={Package}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {order.items?.map((line) => (
                <div key={line.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 9, overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
                    {line.image && <img src={line.image} alt={line.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#222" }}>{line.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>{fmt(line.price)} × {line.quantity}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e156d" }}>{fmt(line.line_total)}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 14, paddingTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888" }}>
                <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888" }}>
                <span>Delivery fee</span><span>{fmt(order.delivery_fee)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "#1e156d" }}>
                <span>Total</span><span>{fmt(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card title="Delivery" icon={Truck}>
            <p style={{ fontSize: 12, color: "#888", margin: "0 0 14px" }}>
              Add a courier and tracking number once the order ships. Shown to the customer on their order page.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <label>
                <span style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 5 }}>Courier</span>
                <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="e.g. GIG Logistics" style={{ width: "100%", boxSizing: "border-box", padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none" }} />
              </label>
              <label>
                <span style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 5 }}>Tracking number</span>
                <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. GIG-4471203" style={{ width: "100%", boxSizing: "border-box", padding: "9px 11px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none" }} />
              </label>
            </div>
            <button
              onClick={saveDelivery}
              disabled={saving}
              style={{ background: "#f2f2f4", color: "#1e156d", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
            >
              {saving ? "Saving…" : saved ? "Saved" : "Save delivery info"}
            </button>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Customer" icon={User}>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#222" }}>{order.full_name}</p>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888" }}>{order.email}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{order.phone}</p>
          </Card>

          <Card title="Delivery Address" icon={MapPin}>
            <p style={{ margin: 0, fontSize: 13, color: "#333", lineHeight: 1.6 }}>
              {order.address}<br />
              {order.city}, {order.state}
            </p>
            {order.notes && (
              <p style={{ margin: "12px 0 0", padding: "10px 12px", background: "#fafafa", borderRadius: 8, fontSize: 12, color: "#888" }}>
                “{order.notes}”
              </p>
            )}
          </Card>

          <Card title="Payment" icon={CreditCard}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 8 }}>
              <span style={{ color: "#888" }}>Method</span>
              <span style={{ color: "#333", fontWeight: 600, textTransform: "capitalize" }}>{order.payment_method === "on_delivery" ? "Pay on delivery" : "Paystack"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
              <span style={{ color: "#888" }}>Status</span>
              <span style={{ color: order.payment_status === "paid" ? "#10b981" : "#f59e0b", fontWeight: 600, textTransform: "capitalize" }}>{order.payment_status}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
