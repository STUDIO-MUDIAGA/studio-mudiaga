"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Heart, ArrowRight, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import DashboardShell from "@/components/mudres/DashboardShell";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const MUTED = "#6F7A5E";
const LINE = "#E7E8E0";
const SURFACE = "#F5F5F1";

const naira = (n: number) => `₦${(n ?? 0).toLocaleString()}`;

type Order = {
  id: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: string;
  created_at: string;
};

export default function MudresDashboardHome() {
  const { profile, user } = useAuth();
  const { count: cartCount } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Order[]) => live && setOrders(Array.isArray(data) ? data : []))
      .catch(() => live && setOrders([]));
    return () => {
      live = false;
    };
  }, []);

  const firstName = (profile?.full_name || "").trim().split(" ")[0];

  return (
    <DashboardShell>
      <h1 style={{ color: DARK, fontSize: "clamp(26px, 3.6vw, 34px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
        {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
      </h1>
      <p style={{ color: MUTED, fontSize: 13.5, margin: "0 0 28px" }}>
        {user?.email}
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: 32 }}>
        <StatCard icon={Package} label="Orders placed" value={orders?.length ?? "—"} href="/mudres/orders" />
        <StatCard icon={Heart} label="Saved pieces" value={wishlistIds.size} href="/mudres/dashboard/wishlist" />
        <StatCard icon={Store} label="Items in cart" value={cartCount} href="/mudres/cart" />
      </div>

      {/* Recent orders */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ color: DARK, fontSize: 16, fontWeight: 700, margin: 0 }}>Recent orders</h2>
        <Link href="/mudres/orders" style={{ color: DARK, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {orders === null && <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>}

      {orders?.length === 0 && (
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
          <p style={{ color: MUTED, fontSize: 13, margin: "0 0 16px" }}>You have not placed an order yet.</p>
          <Link
            href="/mudres/collection"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: DARK, color: WHITE, fontSize: 12.5, fontWeight: 600, padding: "10px 18px", borderRadius: 999, textDecoration: "none" }}
          >
            Browse the collection <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {orders?.slice(0, 3).map((order) => (
        <Link
          key={order.id}
          href="/mudres/orders"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            border: `1px solid ${LINE}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10,
            textDecoration: "none",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ color: DARK, fontSize: 13.5, fontWeight: 600, margin: "0 0 3px" }}>{order.id}</p>
            <p style={{ color: MUTED, fontSize: 12, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {order.items?.map((i) => i.name).join(", ")}
            </p>
          </div>
          <div style={{ textAlign: "right", flex: "0 0 auto" }}>
            <p style={{ color: DARK, fontSize: 13.5, fontWeight: 700, margin: "0 0 3px" }}>{naira(order.total)}</p>
            <p style={{ color: MUTED, fontSize: 11, textTransform: "capitalize", margin: 0 }}>{order.status}</p>
          </div>
        </Link>
      ))}
    </DashboardShell>
  );
}

function StatCard({
  icon: Icon, label, value, href,
}: {
  icon: typeof Package;
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: SURFACE, borderRadius: 16, padding: "16px 18px", textDecoration: "none",
      }}
    >
      <span style={{ width: 38, height: 38, borderRadius: "50%", background: WHITE, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
        <Icon size={17} color={DARK} strokeWidth={1.8} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ color: DARK, fontSize: 19, fontWeight: 700, margin: "0 0 2px" }}>{value}</p>
        <p style={{ color: MUTED, fontSize: 11.5, margin: 0 }}>{label}</p>
      </div>
    </Link>
  );
}
