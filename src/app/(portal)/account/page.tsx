"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Heart, ArrowRight, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAbodeWishlist } from "@/lib/abode-wishlist";
import AbodeDashboardShell from "@/components/abode/AbodeDashboardShell";

const WHITE = "#FFFFFF";
const DARK = "#0a0a0a";
const ORANGE = "#c46442";
const MUTED = "#888888";
const LINE = "#ebebeb";
const SURFACE = "#f7f7f5";

const naira = (n: number) => `₦${(n ?? 0).toLocaleString()}`;

type Booking = {
  id: string;
  checkin: string;
  checkout: string;
  status: string;
  total_amount: number;
  shortlet: { title: string } | null;
};

export default function AccountHome() {
  const { profile, user } = useAuth();
  const { ids: savedIds } = useAbodeWishlist();
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/bookings/shortlets")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Booking[]) => live && setBookings(Array.isArray(data) ? data : []))
      .catch(() => live && setBookings([]));
    return () => {
      live = false;
    };
  }, []);

  const firstName = (profile?.full_name || "").trim().split(" ")[0];

  return (
    <AbodeDashboardShell>
      <h1 style={{ color: DARK, fontSize: "clamp(26px, 3.6vw, 34px)", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 6px" }}>
        {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
      </h1>
      <p style={{ color: MUTED, fontSize: 13.5, margin: "0 0 28px" }}>{user?.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginBottom: 32 }}>
        <StatCard icon={CalendarDays} label="Bookings" value={bookings?.length ?? "—"} href="/account/bookings" />
        <StatCard icon={Heart} label="Saved listings" value={savedIds.size} href="/account/saved" />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ color: DARK, fontSize: 16, fontWeight: 700, margin: 0 }}>Recent bookings</h2>
        <Link href="/account/bookings" style={{ color: DARK, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {bookings === null && <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>}

      {bookings?.length === 0 && (
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
          <p style={{ color: MUTED, fontSize: 13, margin: "0 0 16px" }}>You have not booked a stay yet.</p>
          <Link
            href="/abode/properties"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ORANGE, color: WHITE, fontSize: 12.5, fontWeight: 600, padding: "10px 18px", borderRadius: 999, textDecoration: "none" }}
          >
            <Building2 size={14} /> Browse properties
          </Link>
        </div>
      )}

      {bookings?.slice(0, 3).map((b) => (
        <Link
          key={b.id}
          href="/account/bookings"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            border: `1px solid ${LINE}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10,
            textDecoration: "none",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ color: DARK, fontSize: 13.5, fontWeight: 600, margin: "0 0 3px" }}>{b.shortlet?.title ?? "Property"}</p>
            <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>
              {new Date(b.checkin).toLocaleDateString("en-NG", { day: "numeric", month: "short" })} → {new Date(b.checkout).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
            </p>
          </div>
          <div style={{ textAlign: "right", flex: "0 0 auto" }}>
            <p style={{ color: DARK, fontSize: 13.5, fontWeight: 700, margin: "0 0 3px" }}>{naira(b.total_amount)}</p>
            <p style={{ color: MUTED, fontSize: 11, textTransform: "capitalize", margin: 0 }}>{b.status}</p>
          </div>
        </Link>
      ))}
    </AbodeDashboardShell>
  );
}

function StatCard({
  icon: Icon, label, value, href,
}: {
  icon: typeof CalendarDays;
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
        <Icon size={17} color={ORANGE} strokeWidth={1.8} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{ color: DARK, fontSize: 19, fontWeight: 700, margin: "0 0 2px" }}>{value}</p>
        <p style={{ color: MUTED, fontSize: 11.5, margin: 0 }}>{label}</p>
      </div>
    </Link>
  );
}
