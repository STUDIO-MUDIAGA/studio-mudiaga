"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Clock, CheckCircle, XCircle, Truck, Search, Filter } from "lucide-react";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  item_name: string;
  item_id: string;
  quantity: number;
  total_price: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  delivery_address?: string;
  notes?: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending:    { bg: "#fff8e1", text: "#f59e0b", label: "Pending" },
  confirmed:  { bg: "#e8f4fd", text: "#3b82f6", label: "Confirmed" },
  processing: { bg: "#f3e8ff", text: "#8b5cf6", label: "Processing" },
  shipped:    { bg: "#e8f5e9", text: "#10b981", label: "Shipped" },
  delivered:  { bg: "#e8f5e9", text: "#059669", label: "Delivered" },
  cancelled:  { bg: "#fef2f2", text: "#ef4444", label: "Cancelled" },
};

const TABS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export default function FurnitureOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = async (status: string) => {
    setLoading(true);
    const q = status === "all" ? "" : `?status=${status}`;
    const res = await fetch(`/api/admin/orders/furniture${q}`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(tab); }, [tab]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/furniture/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    load(tab);
  };

  const filtered = orders.filter(
    (o) =>
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      o.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: "32px 28px", minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#1e156d", margin: 0 }}>Furniture Orders</p>
          <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
            {orders.length} {tab === "all" ? "total" : tab} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              style={{ paddingLeft: 32, paddingRight: 12, height: 36, border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", width: 220 }}
            />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 24 }}>
        {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => {
          const icons: Record<string, typeof Clock> = { pending: Clock, confirmed: CheckCircle, processing: Filter, shipped: Truck, delivered: CheckCircle, cancelled: XCircle };
          const Icon = icons[s];
          const c = STATUS_COLORS[s];
          return (
            <div
              key={s}
              onClick={() => setTab(s)}
              style={{ background: "#fff", border: tab === s ? `2px solid ${c.text}` : "1px solid #eee", borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all .15s" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color={c.text} />
                </div>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1e156d", margin: "0 0 2px" }}>{counts[s] ?? 0}</p>
              <p style={{ fontSize: 11, color: "#888", margin: 0, textTransform: "capitalize" }}>{s}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #eee", marginBottom: 20 }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ padding: "10px 18px", fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? "#c46442" : "#666", borderBottom: tab === t ? "2px solid #c46442" : "2px solid transparent", background: "none", border: "none", cursor: "pointer", textTransform: "capitalize" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: "#fafafa" }}>
              {["Order ID", "Customer", "Item", "Qty", "Total", "Status", "Date", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 48, color: "#aaa" }}>Loading orders…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
                <ShoppingBag size={32} style={{ marginBottom: 8, opacity: 0.3, display: "block", margin: "0 auto 8px" }} />
                No orders found
              </td></tr>
            ) : (
              filtered.map((o, i) => {
                const c = STATUS_COLORS[o.status];
                return (
                  <tr
                    key={o.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f5" : "none", backgroundColor: selected?.id === o.id ? "#fffaf8" : "transparent" }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888" }}>{o.id}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ margin: 0, fontWeight: 600, color: "#111" }}>{o.customer_name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{o.customer_email}</p>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ margin: 0, fontWeight: 500, color: "#333" }}>{o.item_name}</p>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#555" }}>{o.quantity}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1e156d" }}>{fmt(o.total_price)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>
                        {c.label}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#888", fontSize: 12 }}>{fmtDate(o.created_at)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <select
                        disabled={updating === o.id}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        defaultValue=""
                        style={{ fontSize: 12, padding: "5px 8px", border: "1px solid #ddd", borderRadius: 6, color: "#555", cursor: "pointer" }}
                      >
                        <option value="" disabled>Update</option>
                        {Object.keys(STATUS_COLORS).filter((s) => s !== o.status).map((s) => (
                          <option key={s} value={s} style={{ textTransform: "capitalize" }}>{STATUS_COLORS[s].label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
