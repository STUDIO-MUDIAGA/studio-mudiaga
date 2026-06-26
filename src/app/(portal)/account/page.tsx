"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, ShoppingBag, MapPin, Package } from "lucide-react";

export default function AccountPage() {
  const { profile, user } = useAuth();
  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>My Account</p>
        <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 700, margin: "0 0 6px" }}>Hello, {displayName}</h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, margin: 0 }}>{user?.email}</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Bookings", value: "0", icon: CalendarDays },
          { label: "Orders", value: "0", icon: ShoppingBag },
          { label: "Shortlets viewed", value: "0", icon: MapPin },
          { label: "Items in cart", value: "0", icon: Package },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px" }}>
            <Icon size={16} color="#fbbf24" style={{ marginBottom: 12 }} />
            <p style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>{value}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Bookings */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarDays size={14} color="#fbbf24" /> Shortlet Bookings
            </h2>
            <Link href="/shortlets" style={{ color: "#fbbf24", fontSize: 12, textDecoration: "none" }}>Browse</Link>
          </div>
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, margin: "0 0 14px" }}>No bookings yet</p>
            <Link href="/shortlets" style={{ display: "inline-block", fontSize: 12, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)", color: "#fbbf24", borderRadius: 20, padding: "7px 16px", textDecoration: "none" }}>
              Explore shortlets
            </Link>
          </div>
        </div>

        {/* Orders */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <ShoppingBag size={14} color="#fbbf24" /> Furniture Orders
            </h2>
            <Link href="/furniture" style={{ color: "#fbbf24", fontSize: 12, textDecoration: "none" }}>Shop</Link>
          </div>
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, margin: "0 0 14px" }}>No orders yet</p>
            <Link href="/furniture" style={{ display: "inline-block", fontSize: 12, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)", color: "#fbbf24", borderRadius: 20, padding: "7px 16px", textDecoration: "none" }}>
              Shop the collection
            </Link>
          </div>
        </div>
      </div>

      {/* Profile card */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
        <h2 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: "0 0 20px" }}>Profile</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Full name", value: profile?.full_name ?? "—" },
            { label: "Email", value: user?.email ?? "—" },
            { label: "Account type", value: profile?.role ?? "customer" },
            { label: "Member since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-NG", { month: "long", year: "numeric" }) : "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
              <p style={{ color: "#fff", fontSize: 13, margin: 0, textTransform: label === "Account type" ? "capitalize" : "none" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
