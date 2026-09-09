"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ArrowRight, MapPin, X } from "lucide-react";
import AbodeDashboardShell from "@/components/abode/AbodeDashboardShell";

const DARK = "#0a0a0a";
const ORANGE = "#c46442";
const MUTED = "#888888";
const LINE = "#ebebeb";
const SURFACE = "#f7f7f5";

const naira = (n: number) => `₦${(n ?? 0).toLocaleString()}`;
const fmt = (d: string) => new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

const STATUS_FILL: Record<string, string> = {
  pending: "#8a6d1f",
  confirmed: "#2f6b8f",
  cancelled: "#8f3a34",
};

type Booking = {
  id: string;
  checkin: string;
  checkout: string;
  guests: number;
  nights: number;
  total_amount: number;
  status: string;
  created_at: string;
  shortlet: { id: string; title: string; city: string; images: string[] } | null;
};

export default function AccountBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = () => {
    fetch("/api/bookings/shortlets")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Booking[]) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  };

  useEffect(load, []);

  const cancel = async (id: string) => {
    setCancellingId(id);
    const res = await fetch(`/api/bookings/shortlets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    setCancellingId(null);
    if (res.ok) load();
  };

  return (
    <AbodeDashboardShell>
      <h1 style={{ color: DARK, fontSize: "clamp(26px, 3.6vw, 34px)", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 6px" }}>
        My Bookings
      </h1>
      <p style={{ color: MUTED, fontSize: 13.5, margin: "0 0 28px" }}>Every stay you have requested with ABODE.</p>

      {bookings === null && <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>}

      {bookings?.length === 0 && (
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 18, padding: "56px 24px", textAlign: "center" }}>
          <CalendarDays size={26} color="#ddd" strokeWidth={1.5} />
          <p style={{ color: MUTED, fontSize: 13.5, margin: "14px 0 20px" }}>You have not booked a stay yet.</p>
          <Link
            href="/abode/properties"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ORANGE, color: "#fff", fontSize: 13, fontWeight: 600, padding: "11px 20px", borderRadius: 999, textDecoration: "none" }}
          >
            Browse properties <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {bookings?.map((b) => (
        <div key={b.id} style={{ display: "flex", gap: 16, border: `1px solid ${LINE}`, borderRadius: 18, padding: 16, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ width: 88, height: 88, borderRadius: 12, overflow: "hidden", background: SURFACE, flex: "0 0 auto" }}>
            {b.shortlet?.images?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.shortlet.images[0]} alt={b.shortlet.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
              <div>
                <p style={{ color: DARK, fontSize: 14.5, fontWeight: 700, margin: "0 0 3px" }}>{b.shortlet?.title ?? "Property"}</p>
                {b.shortlet?.city && (
                  <p style={{ color: MUTED, fontSize: 12, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={11} /> {b.shortlet.city}
                  </p>
                )}
              </div>
              <span
                style={{
                  background: STATUS_FILL[b.status] ?? "#6a6a62", color: "#fff",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 999, flex: "0 0 auto",
                }}
              >
                {b.status}
              </span>
            </div>

            <p style={{ color: MUTED, fontSize: 12.5, margin: "0 0 4px" }}>
              {fmt(b.checkin)} → {fmt(b.checkout)} · {b.nights} night{b.nights !== 1 ? "s" : ""} · {b.guests} guest{b.guests !== 1 ? "s" : ""}
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ color: DARK, fontSize: 15, fontWeight: 700 }}>{naira(b.total_amount)}</span>
              {b.status === "pending" && (
                <button
                  onClick={() => cancel(b.id)}
                  disabled={cancellingId === b.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${LINE}`,
                    borderRadius: 999, padding: "6px 12px", fontSize: 11.5, fontWeight: 600, color: "#8f3a34",
                    cursor: cancellingId === b.id ? "default" : "pointer", opacity: cancellingId === b.id ? 0.6 : 1, fontFamily: "inherit",
                  }}
                >
                  <X size={12} /> {cancellingId === b.id ? "Cancelling…" : "Cancel request"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </AbodeDashboardShell>
  );
}
