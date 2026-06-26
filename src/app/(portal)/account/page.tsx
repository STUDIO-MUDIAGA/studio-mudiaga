"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, ShoppingBag, MapPin, Package } from "lucide-react";

const ORANGE = "#c46442";

export default function AccountPage() {
  const { profile, user } = useAuth();
  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <p style={{ color: ORANGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>My Account</p>
        <h1 style={{ color: "#0a0a0a", fontSize: 30, fontWeight: 700, margin: "0 0 6px" }}>Hello, {displayName}</h1>
        <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>{user?.email}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Bookings", value: "0", icon: CalendarDays },
          { label: "Orders", value: "0", icon: ShoppingBag },
          { label: "Shortlets viewed", value: "0", icon: MapPin },
          { label: "Items in cart", value: "0", icon: Package },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: 20 }}>
            <Icon size={16} color={ORANGE} style={{ marginBottom: 12 }} />
            <p style={{ color: "#0a0a0a", fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>{value}</p>
            <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarDays size={14} color={ORANGE} /> Shortlet Bookings
            </h2>
            <Link href="/abode" style={{ color: ORANGE, fontSize: 12, textDecoration: "none" }}>Browse</Link>
          </div>
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <p style={{ color: "#ccc", fontSize: 13, margin: "0 0 14px" }}>No bookings yet</p>
            <Link href="/abode" style={{ display: "inline-block", fontSize: 12, background: "#fdf0eb", border: "1px solid #f5d4c8", color: ORANGE, borderRadius: 20, padding: "7px 16px", textDecoration: "none" }}>
              Explore shortlets
            </Link>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <ShoppingBag size={14} color={ORANGE} /> Furniture Orders
            </h2>
            <Link href="/mudres" style={{ color: ORANGE, fontSize: 12, textDecoration: "none" }}>Shop</Link>
          </div>
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <p style={{ color: "#ccc", fontSize: 13, margin: "0 0 14px" }}>No orders yet</p>
            <Link href="/mudres" style={{ display: "inline-block", fontSize: 12, background: "#fdf0eb", border: "1px solid #f5d4c8", color: ORANGE, borderRadius: 20, padding: "7px 16px", textDecoration: "none" }}>
              Shop the collection
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 600, margin: 0 }}>Profile</h2>
          <Link href="/account/profile" style={{ color: ORANGE, fontSize: 12, textDecoration: "none" }}>Edit</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Full name", value: profile?.full_name ?? "—" },
            { label: "Email", value: user?.email ?? "—" },
            { label: "Account type", value: profile?.role ?? "customer" },
            { label: "Member since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-NG", { month: "long", year: "numeric" }) : "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ color: "#bbb", fontSize: 11, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
              <p style={{ color: "#0a0a0a", fontSize: 13, margin: 0, textTransform: label === "Account type" ? "capitalize" : "none" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
