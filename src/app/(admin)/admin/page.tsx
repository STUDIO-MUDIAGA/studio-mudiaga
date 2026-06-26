"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, CalendarDays, ShoppingBag, Building2, Sofa, Users, TrendingUp } from "lucide-react";

const NAVY = "#1e156d";

const quickLinks = [
  { label: "Manage Shortlets", href: "/admin/shortlets", icon: Building2,    desc: "Add, edit, or remove listings" },
  { label: "Manage Furniture", href: "/admin/furniture",  icon: Sofa,         desc: "Manage the furniture catalogue" },
  { label: "Bookings",         href: "/admin/bookings",   icon: CalendarDays, desc: "View and manage all bookings" },
  { label: "Orders",           href: "/admin/orders",     icon: ShoppingBag,  desc: "Track furniture orders" },
  { label: "Users",            href: "/admin/users",      icon: Users,        desc: "Manage registered accounts" },
  { label: "Analytics",        href: "/admin/analytics",  icon: TrendingUp,   desc: "Traffic and revenue insights" },
];

type Stats = { shortlets: number; furniture: number; bookings: number; users: number };

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ shortlets: 0, furniture: 0, bookings: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/shortlets").then((r) => r.json()),
      fetch("/api/admin/furniture").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ]).then(([shortlets, furniture, extra]) => {
      setStats({
        shortlets: Array.isArray(shortlets) ? shortlets.length : 0,
        furniture: Array.isArray(furniture) ? furniture.length : 0,
        bookings: extra?.bookings ?? 0,
        users: extra?.users ?? 0,
      });
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Active Shortlets", value: stats.shortlets, icon: Building2,   color: "#ede9fd" },
    { label: "Furniture Items",  value: stats.furniture,  icon: Sofa,        color: "#fdf0e9" },
    { label: "Total Bookings",   value: stats.bookings,   icon: CalendarDays, color: "#e9f0fd" },
    { label: "Registered Users", value: stats.users,      icon: Users,       color: "#e9fdf0" },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: NAVY, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 6 }}>
          <LayoutDashboard size={10} /> Overview
        </p>
        <h1 style={{ color: "#0a0a0a", fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>Dashboard</h1>
        <p style={{ color: "#888", fontSize: 13, margin: 0 }}>Welcome back, {user?.email}</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "20px 20px 18px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon size={16} style={{ color: NAVY }} />
            </div>
            <p style={{ color: "#0a0a0a", fontSize: 32, fontWeight: 700, margin: "0 0 4px", lineHeight: 1 }}>
              {loading ? "—" : value}
            </p>
            <p style={{ color: "#888", fontSize: 12, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Manage */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: "#aaa", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>Manage</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {quickLinks.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: 18, textDecoration: "none", transition: "all 0.15s" }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = NAVY; e.currentTarget.style.boxShadow = "0 2px 12px rgba(30,21,109,0.08)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e8e8e4"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0effe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} style={{ color: NAVY }} />
              </div>
              <div>
                <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: "0 0 3px" }}>{label}</p>
                <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: 24 }}>
        <p style={{ color: "#aaa", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 20px" }}>Recent Activity</p>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>Bookings and orders will appear here once customers start transacting.</p>
        </div>
      </div>
    </div>
  );
}
