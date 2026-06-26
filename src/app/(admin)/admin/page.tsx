"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, CalendarDays, ShoppingBag,
  Building2, Sofa, Users, TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Total Bookings",    value: "0", icon: CalendarDays },
  { label: "Furniture Orders",  value: "0", icon: ShoppingBag },
  { label: "Active Shortlets",  value: "0", icon: Building2 },
  { label: "Registered Users",  value: "0", icon: Users },
];

const quickLinks = [
  { label: "Manage Shortlets", href: "/admin/shortlets", icon: Building2,    desc: "Add, edit, or remove listings" },
  { label: "Manage Furniture", href: "/admin/furniture",  icon: Sofa,         desc: "Manage the furniture catalogue" },
  { label: "Bookings",         href: "/admin/bookings",   icon: CalendarDays, desc: "View and manage all bookings" },
  { label: "Orders",           href: "/admin/orders",     icon: ShoppingBag,  desc: "Track furniture orders" },
  { label: "Users",            href: "/admin/users",      icon: Users,        desc: "Manage registered accounts" },
  { label: "Analytics",        href: "/admin/analytics",  icon: TrendingUp,   desc: "Traffic and revenue insights" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 6 }}>
          <LayoutDashboard size={10} /> Overview
        </p>
        <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>Dashboard</h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, margin: 0 }}>Welcome back, {user?.email}</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 36 }}>
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 20px 18px" }}>
            <Icon size={15} style={{ color: "#fbbf24", marginBottom: 16, display: "block" }} />
            <p style={{ color: "#fff", fontSize: 32, fontWeight: 700, margin: "0 0 4px", lineHeight: 1 }}>{value}</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Manage */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 14px" }}>Manage</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {quickLinks.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 18, textDecoration: "none", transition: "all 0.15s" }}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={15} style={{ color: "#fbbf24" }} />
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500, margin: "0 0 3px" }}>{label}</p>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, margin: 0 }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 20px" }}>Recent Activity</p>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 13, margin: 0 }}>No activity yet. Bookings and orders will appear here.</p>
        </div>
      </div>

    </div>
  );
}
