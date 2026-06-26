"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Star, MapPin, BedDouble, Bath, Users, Check,
  Wifi, Tv, Car, Dumbbell, Waves, UtensilsCrossed, ShieldCheck,
  Clock, X, ChevronLeft, ChevronRight, Share2, Heart, Building2,
  Moon, CalendarDays, Loader2,
} from "lucide-react";

const ORANGE = "#c46442";

type Shortlet = {
  id: string; title: string; location: string; city: string;
  price: number; currency: string;
  property_type: string; description: string;
  bedrooms: number; bathrooms: number; guests: number;
  amenities: string[]; images: string[];
  host: { name: string; avatar: string; superhost: boolean };
  checkin: string; checkout: string; min_nights: number;
  rules: string[]; tags: string[];
  rating: number; review_count: number; available: boolean;
};

const AMENITY_ICON: Record<string, React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>> = {
  "WiFi": Wifi, "AC": Waves, "Smart TV": Tv, "Kitchen": UtensilsCrossed,
  "Parking": Car, "Pool": Waves, "Gym": Dumbbell, "Security": ShieldCheck,
};

function AmenityIcon({ name }: { name: string }) {
  const Icon = AMENITY_ICON[name];
  return Icon
    ? <Icon size={14} color={ORANGE} />
    : <Check size={14} color={ORANGE} />;
}

function today() {
  return new Date().toISOString().split("T")[0];
}
function addDays(date: string, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function daysBetween(a: string, b: string) {
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [shortlet, setShortlet] = useState<Shortlet | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [checkin, setCheckin] = useState(addDays(today(), 3));
  const [checkout, setCheckout] = useState(addDays(today(), 6));
  const [guests, setGuests] = useState(2);
  const [saved, setSaved] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/shortlets/${id}`)
      .then((r) => r.json())
      .then((d) => { setShortlet(d); setGuests(Math.min(2, d.guests)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("abode_favourites") ?? "[]");
      setSaved(favs.includes(id));
    } catch { /* ignore */ }
  }, [id]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function toggleSaved() {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("abode_favourites") ?? "[]");
      const next = saved ? favs.filter((f) => f !== id) : [...favs, id];
      localStorage.setItem("abode_favourites", JSON.stringify(next));
      setSaved(!saved);
      showToast(saved ? "Removed from saved" : "Saved to your favourites");
    } catch { /* ignore */ }
  }

  async function handleShare() {
    const url = window.location.href;
    const title = shortlet?.title ?? "ABODE Property";
    const text = `Check out ${title} on Studio Mudiaga ABODE`;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch { /* user cancelled */ return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Copy this link: " + url);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
        <Loader2 size={24} color="#ddd" style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!shortlet) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
        <p style={{ color: "#888", fontSize: 15, marginBottom: 16 }}>Property not found</p>
        <Link href="/abode/properties" style={{ color: ORANGE, fontSize: 13, textDecoration: "none" }}>← Back to properties</Link>
      </div>
    );
  }

  const nights = Math.max(shortlet.min_nights || 1, daysBetween(checkin, checkout));
  const total = shortlet.price * nights;
  const serviceFee = Math.round(total * 0.05);

  // ── Gallery ──────────────────────────────────────────────────────
  const imgs = shortlet.images.length > 0 ? shortlet.images : [""];
  const hasMany = imgs.length > 1;

  return (
    <div style={{ background: "#f8f8f6", minHeight: "100vh", paddingTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 32px 0" }}>
        <Link href="/abode/properties" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#aaa", fontSize: 12, textDecoration: "none" }}>
          <ArrowLeft size={12} /> All Properties
        </Link>
      </div>

      {/* ── Gallery ── */}
      <div style={{ maxWidth: 1200, margin: "12px auto 0", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: hasMany ? "1fr 1fr" : "1fr", gridTemplateRows: "340px", gap: 6, borderRadius: 18, overflow: "hidden" }}>
          {/* Main image */}
          <div
            style={{ position: "relative", gridRow: "1", cursor: "pointer", background: "#e8e8e4", overflow: "hidden" }}
            onClick={() => setLightbox(0)}
          >
            {imgs[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgs[0]} alt={shortlet.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={40} color="#ccc" />
              </div>
            )}
            {/* View all button */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(0); }}
              style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(255,255,255,0.92)", border: "1px solid #e0e0e0", borderRadius: 10, padding: "7px 14px", fontSize: 11, fontWeight: 600, color: "#333", cursor: "pointer", backdropFilter: "blur(6px)" }}
            >
              View all {imgs.length} photo{imgs.length !== 1 ? "s" : ""}
            </button>
          </div>

          {/* Side thumbnails */}
          {hasMany && (
            <div style={{ display: "grid", gridTemplateRows: imgs.length >= 3 ? "1fr 1fr" : "1fr", gridTemplateColumns: imgs.length >= 4 ? "1fr 1fr" : "1fr", gap: 6, overflow: "hidden" }}>
              {imgs.slice(1, 5).map((url, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i + 1)}
                  style={{ position: "relative", background: "#e8e8e4", overflow: "hidden", cursor: "pointer" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {url && <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                  {/* More overlay */}
                  {i === 3 && imgs.length > 5 && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>+{imgs.length - 5}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1200, margin: "32px auto", padding: "0 32px 80px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "flex-start" }}>

        {/* ── LEFT ── */}
        <div>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <span style={{ background: "#fdf0eb", color: ORANGE, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {shortlet.property_type}
              </span>
              <h1 style={{ color: "#0a0a0a", fontSize: 26, fontWeight: 700, margin: "10px 0 4px", lineHeight: 1.2 }}>{shortlet.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#555", fontSize: 12 }}>
                  <MapPin size={12} color={ORANGE} /> {shortlet.location}, {shortlet.city}
                </div>
                {shortlet.rating > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={12} fill={ORANGE} color={ORANGE} />
                    <span style={{ color: "#555", fontSize: 12, fontWeight: 600 }}>{shortlet.rating}</span>
                    <span style={{ color: "#bbb", fontSize: 12 }}>({shortlet.review_count} review{shortlet.review_count !== 1 ? "s" : ""})</span>
                  </div>
                )}
                {shortlet.host.superhost && (
                  <span style={{ background: "#fdf0eb", color: ORANGE, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6 }}>Superhost</span>
                )}
              </div>
            </div>
            {/* Save + Share */}
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={toggleSaved} title={saved ? "Remove from saved" : "Save property"} style={{ width: 38, height: 38, borderRadius: "50%", background: saved ? "#fdf0eb" : "#fff", border: `1px solid ${saved ? ORANGE + "44" : "#e8e8e4"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}>
                <Heart size={15} fill={saved ? ORANGE : "none"} color={saved ? ORANGE : "#aaa"} />
              </button>
              <button onClick={handleShare} title="Share this property" style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #e8e8e4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Share2 size={15} color="#aaa" />
              </button>
            </div>
          </div>

          {/* Stats pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0", paddingBottom: 22, borderBottom: "1px solid #ebebeb" }}>
            {[
              { icon: BedDouble, label: `${shortlet.bedrooms} bedroom${shortlet.bedrooms !== 1 ? "s" : ""}` },
              { icon: Bath, label: `${shortlet.bathrooms} bathroom${shortlet.bathrooms !== 1 ? "s" : ""}` },
              { icon: Users, label: `Up to ${shortlet.guests} guests` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, padding: "8px 14px" }}>
                <Icon size={13} color={ORANGE} />
                <span style={{ color: "#555", fontSize: 12, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {shortlet.description && (
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #ebebeb" }}>
              <h2 style={{ color: "#0a0a0a", fontSize: 16, fontWeight: 700, margin: "0 0 10px" }}>About this space</h2>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.75, margin: 0 }}>{shortlet.description}</p>
            </div>
          )}

          {/* Amenities */}
          {shortlet.amenities.length > 0 && (
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #ebebeb" }}>
              <h2 style={{ color: "#0a0a0a", fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>What&apos;s included</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {shortlet.amenities.map((a) => (
                  <div key={a} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10 }}>
                    <AmenityIcon name={a} />
                    <span style={{ color: "#444", fontSize: 13 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check-in / Check-out / Min nights */}
          <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #ebebeb" }}>
            <h2 style={{ color: "#0a0a0a", fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>Stay details</h2>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: CalendarDays, label: "Check-in", value: shortlet.checkin || "14:00" },
                { icon: CalendarDays, label: "Check-out", value: shortlet.checkout || "11:00" },
                { icon: Moon, label: "Min stay", value: `${shortlet.min_nights || 1} night${(shortlet.min_nights || 1) !== 1 ? "s" : ""}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ flex: 1, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <Icon size={13} color={ORANGE} />
                    <span style={{ color: "#aaa", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                  </div>
                  <span style={{ color: "#0a0a0a", fontSize: 15, fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House rules */}
          {shortlet.rules.length > 0 && (
            <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #ebebeb" }}>
              <h2 style={{ color: "#0a0a0a", fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>House rules</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {shortlet.rules.map((r) => (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff5f5", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <X size={11} color="#dc2626" />
                    </div>
                    <span style={{ color: "#555", fontSize: 13 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Host */}
          <div>
            <h2 style={{ color: "#0a0a0a", fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>Hosted by</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: 20 }}>
              <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#fdf0eb", border: `2px solid ${ORANGE}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: ORANGE, fontSize: 20, fontWeight: 700 }}>{shortlet.host.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#0a0a0a", fontSize: 15, fontWeight: 700 }}>{shortlet.host.name}</span>
                  {shortlet.host.superhost && (
                    <span style={{ background: "#fdf0eb", color: ORANGE, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5 }}>Superhost</span>
                  )}
                </div>
                <p style={{ color: "#888", fontSize: 12, margin: "3px 0 0" }}>Studio Mudiaga Host · Typically responds within an hour</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Booking card ── */}
        <div style={{ position: "sticky", top: 84 }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: 24, boxShadow: "0 4px 30px rgba(0,0,0,0.06)" }}>
            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
              <span style={{ color: "#0a0a0a", fontSize: 26, fontWeight: 800 }}>₦{shortlet.price.toLocaleString()}</span>
              <span style={{ color: "#aaa", fontSize: 13 }}>/ night</span>
              {shortlet.rating > 0 && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={11} fill={ORANGE} color={ORANGE} />
                  <span style={{ color: "#555", fontSize: 12, fontWeight: 600 }}>{shortlet.rating}</span>
                </div>
              )}
            </div>

            {/* Date pickers */}
            <div style={{ border: "1px solid #e0e0e0", borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #e0e0e0" }}>
                <div style={{ padding: "12px 14px", borderRight: "1px solid #e0e0e0" }}>
                  <div style={{ color: "#aaa", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Check-in</div>
                  <input
                    type="date"
                    value={checkin}
                    min={today()}
                    onChange={(e) => {
                      setCheckin(e.target.value);
                      if (e.target.value >= checkout) setCheckout(addDays(e.target.value, shortlet.min_nights || 1));
                    }}
                    style={{ border: "none", outline: "none", color: "#0a0a0a", fontSize: 13, fontWeight: 600, background: "transparent", width: "100%", cursor: "pointer" }}
                  />
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ color: "#aaa", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Check-out</div>
                  <input
                    type="date"
                    value={checkout}
                    min={addDays(checkin, shortlet.min_nights || 1)}
                    onChange={(e) => setCheckout(e.target.value)}
                    style={{ border: "none", outline: "none", color: "#0a0a0a", fontSize: 13, fontWeight: 600, background: "transparent", width: "100%", cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Guests */}
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: "#aaa", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Guests</div>
                  <span style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600 }}>{guests} guest{guests !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #e0e0e0", background: "#fff", cursor: guests === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: guests === 1 ? "#ddd" : "#555", fontSize: 16, lineHeight: 1 }}
                    disabled={guests === 1}
                  >−</button>
                  <span style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: "center" }}>{guests}</span>
                  <button
                    onClick={() => setGuests((g) => Math.min(shortlet.guests, g + 1))}
                    style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #e0e0e0", background: "#fff", cursor: guests === shortlet.guests ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: guests === shortlet.guests ? "#ddd" : "#555", fontSize: 16, lineHeight: 1 }}
                    disabled={guests === shortlet.guests}
                  >+</button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => { setRequesting(true); setTimeout(() => { setRequesting(false); setRequested(true); }, 1500); }}
              disabled={requesting || requested}
              style={{ width: "100%", background: requested ? "#15803d" : ORANGE, color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 14, fontWeight: 700, cursor: requesting || requested ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s", marginBottom: 10 }}
            >
              {requesting
                ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending request…</>
                : requested
                  ? <><Check size={15} /> Request sent!</>
                  : "Request to Book"
              }
            </button>

            <p style={{ color: "#bbb", fontSize: 11, textAlign: "center", margin: "0 0 16px" }}>You won&apos;t be charged yet</p>

            {/* Price breakdown */}
            {nights > 0 && (
              <div style={{ borderTop: "1px solid #f0f0ee", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555", fontSize: 13 }}>₦{shortlet.price.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}</span>
                  <span style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 500 }}>₦{total.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555", fontSize: 13 }}>Service fee</span>
                  <span style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 500 }}>₦{serviceFee.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: "1px solid #f0f0ee", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700 }}>Total</span>
                  <span style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700 }}>₦{(total + serviceFee).toLocaleString()}</span>
                </div>
                <p style={{ color: "#bbb", fontSize: 10, margin: "4px 0 0", textAlign: "right" }}>
                  {fmt(checkin)} → {fmt(checkout)}
                </p>
              </div>
            )}
          </div>

          {/* Superhost note */}
          {shortlet.host.superhost && (
            <div style={{ marginTop: 12, background: "#fdf0eb", border: `1px solid ${ORANGE}33`, borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10 }}>
              <Star size={14} fill={ORANGE} color={ORANGE} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: "#555", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: "#0a0a0a" }}>{shortlet.host.name}</strong> is a Superhost — one of our most experienced and highly rated hosts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={18} color="#fff" />
            </button>

            {/* Counter */}
            <span style={{ position: "absolute", top: 26, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
              {lightbox + 1} / {imgs.length}
            </span>

            {/* Prev */}
            {imgs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! - 1 + imgs.length) % imgs.length); }}
                style={{ position: "absolute", left: 20, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronLeft size={20} color="#fff" />
              </button>
            )}

            {/* Image */}
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "85vw", maxHeight: "85vh" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {imgs[lightbox] && <img src={imgs[lightbox]} alt="" style={{ maxWidth: "85vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 8 }} />}
            </div>

            {/* Next */}
            {imgs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! + 1) % imgs.length); }}
                style={{ position: "absolute", right: 20, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChevronRight size={20} color="#fff" />
              </button>
            )}

            {/* Thumbnails strip */}
            {imgs.length > 1 && (
              <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                {imgs.map((url, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                    style={{ width: 48, height: 34, borderRadius: 6, overflow: "hidden", border: `2px solid ${i === lightbox ? "#fff" : "transparent"}`, padding: 0, cursor: "pointer", background: "#333", opacity: i === lightbox ? 1 : 0.5, transition: "all 0.15s" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {url && <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: 28, left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "12px"})`,
        background: "#0a0a0a", color: "#fff", borderRadius: 12, padding: "11px 20px",
        fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", zIndex: 300,
        opacity: toast ? 1 : 0, transition: "opacity 0.2s, transform 0.2s",
        pointerEvents: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}>
        {toast}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
