"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, CalendarDays, Check, X, Clock, Loader2,
  User, Mail, Phone, Building2, ChevronDown, Search,
  AlertCircle, MoreHorizontal,
} from "lucide-react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";
const ORANGE = "#c46442";

type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  checkin: string;
  checkout: string;
  guests: number;
  nights: number;
  price_per_night: number;
  service_fee: number;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled";
  notes: string;
  created_at: string;
  shortlet: { id: string; title: string; city: string; images: string[] } | null;
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: "#fef3c7", color: "#b45309", label: "Pending" },
  confirmed: { bg: "#dcfce7", color: "#15803d", label: "Confirmed" },
  cancelled: { bg: "#fee2e2", color: "#dc2626", label: "Cancelled" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6 }}>{s.label}</span>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ShortletBookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [detail, setDetail] = useState<Booking | null>(null);

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, [supabase]);

  const load = useCallback(async () => {
    const token = await getToken();
    const url = statusFilter !== "all" ? `/api/admin/bookings/shortlets?status=${statusFilter}` : "/api/admin/bookings/shortlets";
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { setError("Failed to load bookings"); setLoading(false); return; }
    setBookings(await res.json());
    setLoading(false);
  }, [getToken, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const token = await getToken();
    await fetch(`/api/admin/bookings/shortlets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    setActionId(null);
    setDetail(null);
    load();
  }

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.guest_name.toLowerCase().includes(q) ||
      b.guest_email.toLowerCase().includes(q) ||
      b.shortlet?.title.toLowerCase().includes(q) ||
      b.shortlet?.city.toLowerCase().includes(q);
  });

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Link href="/admin/shortlets" style={{ display: "flex", alignItems: "center", gap: 5, color: "#aaa", fontSize: 12, textDecoration: "none" }}>
          <ArrowLeft size={12} /> Shortlets
        </Link>
        <div style={{ width: 1, height: 16, background: "#e8e8e4" }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ color: "#0a0a0a", fontSize: 20, fontWeight: 700, margin: 0 }}>Apartment Bookings</h1>
          <p style={{ color: "#aaa", fontSize: 12, margin: "2px 0 0" }}>{counts.all} total · {counts.pending} pending</p>
        </div>
      </div>

      {/* Stat pills */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", transition: "all 0.15s",
              background: statusFilter === s ? (s === "pending" ? "#fef3c7" : s === "confirmed" ? "#dcfce7" : s === "cancelled" ? "#fee2e2" : NAVY_BG) : "#fff",
              borderColor: statusFilter === s ? (s === "pending" ? "#b45309" : s === "confirmed" ? "#15803d" : s === "cancelled" ? "#dc2626" : NAVY) : "#e8e8e4",
              color: statusFilter === s ? (s === "pending" ? "#b45309" : s === "confirmed" ? "#15803d" : s === "cancelled" ? "#dc2626" : NAVY) : "#888",
            }}
          >
            {s === "pending" && <Clock size={12} />}
            {s === "confirmed" && <Check size={12} />}
            {s === "cancelled" && <X size={12} />}
            {s === "all" && <CalendarDays size={12} />}
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span style={{ background: "rgba(0,0,0,0.08)", borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>{counts[s]}</span>
          </button>
        ))}

        {/* Search */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, padding: "8px 14px" }}>
          <Search size={12} color="#ccc" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest or property…"
            style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "#555", width: 200 }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
          <Loader2 size={20} color="#ddd" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      ) : error ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#dc2626", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: 16 }}>
          <AlertCircle size={15} /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "60px 0", textAlign: "center" }}>
          <CalendarDays size={32} color="#e0e0e0" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#bbb", fontSize: 14 }}>No bookings {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, overflow: "hidden" }}>
          {/* Table head */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr 80px", gap: 0, padding: "12px 20px", background: "#f8f8f8", borderBottom: "1px solid #f0f0f0" }}>
            {["Guest", "Property", "Dates", "Amount", "Status", ""].map((h) => (
              <span key={h} style={{ color: "#aaa", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((b, i) => (
            <div
              key={b.id}
              style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr 80px", gap: 0, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f3" : "none", alignItems: "center", cursor: "pointer", transition: "background 0.1s" }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafaf9"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              onClick={() => setDetail(b)}
            >
              {/* Guest */}
              <div>
                <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{b.guest_name}</p>
                <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>{b.guest_email}</p>
              </div>

              {/* Property */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 34, height: 26, borderRadius: 6, overflow: "hidden", background: "#f0f0ee", flexShrink: 0 }}>
                  {b.shortlet?.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.shortlet.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: "#555", fontSize: 12, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.shortlet?.title ?? "—"}</p>
                  <p style={{ color: "#bbb", fontSize: 11, margin: "1px 0 0" }}>{b.shortlet?.city}</p>
                </div>
              </div>

              {/* Dates */}
              <div>
                <p style={{ color: "#555", fontSize: 12, margin: "0 0 1px" }}>{fmt(b.checkin)} →</p>
                <p style={{ color: "#555", fontSize: 12, margin: 0 }}>{fmt(b.checkout)}</p>
                <p style={{ color: "#bbb", fontSize: 10, margin: "2px 0 0" }}>{b.nights} night{b.nights !== 1 ? "s" : ""} · {b.guests} guest{b.guests !== 1 ? "s" : ""}</p>
              </div>

              {/* Amount */}
              <div>
                <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 700, margin: "0 0 1px" }}>₦{b.total_amount.toLocaleString()}</p>
                <p style={{ color: "#bbb", fontSize: 10, margin: 0 }}>incl. fees</p>
              </div>

              {/* Status */}
              <div><StatusBadge status={b.status} /></div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setActionId(actionId === b.id ? null : b.id)}
                    style={{ width: 30, height: 30, borderRadius: 8, background: "#f2f2f4", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <MoreHorizontal size={14} color="#888" />
                  </button>
                  {actionId === b.id && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setActionId(null)} />
                      <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 20, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 12, padding: 6, minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                        {b.status !== "confirmed" && (
                          <button
                            onClick={() => updateStatus(b.id, "confirmed")}
                            disabled={updating === b.id}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 8, background: "none", border: "none", color: "#15803d", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                          >
                            {updating === b.id ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={12} />}
                            Confirm booking
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => updateStatus(b.id, "cancelled")}
                            disabled={updating === b.id}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 8, background: "none", border: "none", color: "#dc2626", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                          >
                            <X size={12} /> Cancel booking
                          </button>
                        )}
                        {b.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(b.id, "pending")}
                            disabled={updating === b.id}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 8, background: "none", border: "none", color: "#b45309", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                          >
                            <Clock size={12} /> Set to pending
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail drawer ── */}
      {detail && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} onClick={() => setDetail(null)} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: "#fff", zIndex: 101, boxShadow: "-8px 0 40px rgba(0,0,0,0.08)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Drawer header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <p style={{ color: "#aaa", fontSize: 11, margin: "0 0 2px" }}>Booking #{detail.id.slice(0, 8).toUpperCase()}</p>
                <StatusBadge status={detail.status} />
              </div>
              <button onClick={() => setDetail(null)} style={{ background: "#f2f2f4", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={14} color="#666" />
              </button>
            </div>

            <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Property */}
              {detail.shortlet && (
                <div style={{ background: "#f8f8f6", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 52, height: 40, borderRadius: 8, overflow: "hidden", background: "#e8e8e4", flexShrink: 0 }}>
                    {detail.shortlet.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={detail.shortlet.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <div>
                    <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{detail.shortlet.title}</p>
                    <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>{detail.shortlet.city}</p>
                  </div>
                  <Link href={`/abode/properties/${detail.shortlet.id}`} target="_blank" style={{ marginLeft: "auto", color: ORANGE, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>View →</Link>
                </div>
              )}

              {/* Guest info */}
              <div>
                <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px" }}>Guest</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <User size={13} color="#bbb" />
                    <span style={{ color: "#555", fontSize: 13 }}>{detail.guest_name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Mail size={13} color="#bbb" />
                    <a href={`mailto:${detail.guest_email}`} style={{ color: NAVY, fontSize: 13, textDecoration: "none" }}>{detail.guest_email}</a>
                  </div>
                  {detail.guest_phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Phone size={13} color="#bbb" />
                      <a href={`tel:${detail.guest_phone}`} style={{ color: NAVY, fontSize: 13, textDecoration: "none" }}>{detail.guest_phone}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Stay */}
              <div>
                <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px" }}>Stay Details</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Check-in", value: fmt(detail.checkin) },
                    { label: "Check-out", value: fmt(detail.checkout) },
                    { label: "Nights", value: `${detail.nights} night${detail.nights !== 1 ? "s" : ""}` },
                    { label: "Guests", value: `${detail.guests} guest${detail.guests !== 1 ? "s" : ""}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: "#f8f8f6", borderRadius: 10, padding: "10px 12px" }}>
                      <p style={{ color: "#aaa", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>{label}</p>
                      <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px" }}>Pricing</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#555", fontSize: 12 }}>₦{detail.price_per_night.toLocaleString()} × {detail.nights} night{detail.nights !== 1 ? "s" : ""}</span>
                    <span style={{ color: "#0a0a0a", fontSize: 12, fontWeight: 500 }}>₦{(detail.price_per_night * detail.nights).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#555", fontSize: 12 }}>Service fee</span>
                    <span style={{ color: "#0a0a0a", fontSize: 12, fontWeight: 500 }}>₦{detail.service_fee.toLocaleString()}</span>
                  </div>
                  <div style={{ borderTop: "1px solid #e8e8e4", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700 }}>Total</span>
                    <span style={{ color: ORANGE, fontSize: 14, fontWeight: 800 }}>₦{detail.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {detail.notes && (
                <div>
                  <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>Special Requests</p>
                  <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6, background: "#f8f8f6", borderRadius: 10, padding: "10px 14px", margin: 0 }}>{detail.notes}</p>
                </div>
              )}

              {/* Requested on */}
              <p style={{ color: "#ccc", fontSize: 11, margin: 0 }}>Requested {fmt(detail.created_at)}</p>
            </div>

            {/* Actions footer */}
            {detail.status !== "cancelled" && (
              <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8, flexShrink: 0 }}>
                {detail.status === "pending" && (
                  <button
                    onClick={() => updateStatus(detail.id, "confirmed")}
                    disabled={updating === detail.id}
                    style={{ flex: 1, background: "#15803d", color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                  >
                    {updating === detail.id ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                    Confirm
                  </button>
                )}
                <button
                  onClick={() => updateStatus(detail.id, "cancelled")}
                  disabled={updating === detail.id}
                  style={{ flex: 1, background: "#fff", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
