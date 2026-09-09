"use client";

import { useEffect, useState, use } from "react";
import { Printer } from "lucide-react";

type OrderLine = { id: string; name: string; price: number; image: string | null; quantity: number; line_total: number };
type Order = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  items: OrderLine[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "paystack" | "on_delivery";
  payment_status: string;
  status: string;
  created_at: string;
};

const DARK = "#2A3812";
const fmt = (n: number) => "₦" + (n ?? 0).toLocaleString("en-NG");
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/furniture/${id}`).then((r) => r.json()).then(setOrder);
  }, [id]);

  if (!order) return <div style={{ padding: 60, textAlign: "center", color: "#aaa" }}>Loading invoice…</div>;

  return (
    <div className="invoice-page" style={{ background: "#fff", minHeight: "100vh" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .invoice-page { padding: 0 !important; }
        }
      `}</style>

      <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", padding: "20px 40px 0" }}>
        <button
          onClick={() => window.print()}
          style={{ display: "flex", alignItems: "center", gap: 8, background: DARK, color: "#fff", border: "none", borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 40px 80px" }}>
        {/* Letterhead */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, paddingBottom: 24, borderBottom: `2px solid ${DARK}` }}>
          <div>
            <p style={{ color: DARK, fontSize: 20, fontWeight: 800, letterSpacing: "0.04em", margin: "0 0 4px" }}>MUDRES</p>
            <p style={{ color: "#888", fontSize: 12, margin: 0 }}>by Studio Mudiaga</p>
            <p style={{ color: "#888", fontSize: 12, margin: "2px 0 0" }}>hello@studiomudiaga.com</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: DARK, fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>INVOICE</p>
            <p style={{ color: "#888", fontSize: 12, margin: 0, fontFamily: "monospace" }}>{order.id}</p>
            <p style={{ color: "#888", fontSize: 12, margin: "2px 0 0" }}>{fmtDate(order.created_at)}</p>
          </div>
        </div>

        {/* Bill to / status */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <p style={{ color: "#aaa", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>Billed to</p>
            <p style={{ color: "#222", fontSize: 13, fontWeight: 600, margin: "0 0 3px" }}>{order.full_name}</p>
            <p style={{ color: "#666", fontSize: 12, margin: "0 0 3px" }}>{order.email}</p>
            <p style={{ color: "#666", fontSize: 12, margin: "0 0 3px" }}>{order.phone}</p>
            <p style={{ color: "#666", fontSize: 12, margin: 0, lineHeight: 1.6 }}>{order.address}, {order.city}, {order.state}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#aaa", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>Payment</p>
            <p style={{ color: "#222", fontSize: 12, margin: "0 0 3px", textTransform: "capitalize" }}>{order.payment_method === "on_delivery" ? "Pay on delivery" : "Paystack"}</p>
            <p style={{ color: order.payment_status === "paid" ? "#10b981" : "#f59e0b", fontSize: 12, fontWeight: 700, margin: 0, textTransform: "capitalize" }}>{order.payment_status}</p>
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${DARK}` }}>
              <th style={{ textAlign: "left", padding: "0 0 10px", fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Item</th>
              <th style={{ textAlign: "center", padding: "0 0 10px", fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "0 0 10px", fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</th>
              <th style={{ textAlign: "right", padding: "0 0 10px", fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((line) => (
              <tr key={line.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "12px 0", fontSize: 13, color: "#222" }}>{line.name}</td>
                <td style={{ padding: "12px 0", fontSize: 13, color: "#666", textAlign: "center" }}>{line.quantity}</td>
                <td style={{ padding: "12px 0", fontSize: 13, color: "#666", textAlign: "right" }}>{fmt(line.price)}</td>
                <td style={{ padding: "12px 0", fontSize: 13, color: "#222", fontWeight: 600, textAlign: "right" }}>{fmt(line.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 48 }}>
          <div style={{ width: 220 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 8 }}>
              <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 8 }}>
              <span>Delivery</span><span>{fmt(order.delivery_fee)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: DARK, paddingTop: 8, borderTop: `2px solid ${DARK}` }}>
              <span>Total</span><span>{fmt(order.total)}</span>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#bbb", fontSize: 11, margin: 0 }}>
          Thank you for shopping with MUDRES — handcrafted furniture by Studio Mudiaga.
        </p>
      </div>
    </div>
  );
}
