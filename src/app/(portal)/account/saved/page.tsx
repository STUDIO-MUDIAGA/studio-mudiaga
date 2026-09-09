"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Star } from "lucide-react";
import AbodeDashboardShell from "@/components/abode/AbodeDashboardShell";
import { useAbodeWishlist } from "@/lib/abode-wishlist";

const WHITE = "#FFFFFF";
const DARK = "#0a0a0a";
const ORANGE = "#c46442";
const MUTED = "#888888";
const LINE = "#ebebeb";

type SavedListing = {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  images: string[] | null;
  rating: number;
  review_count: number;
  available: boolean;
};

export default function AccountSavedPage() {
  const [items, setItems] = useState<SavedListing[] | null>(null);
  const { toggle } = useAbodeWishlist();

  const load = () => {
    fetch("/api/abode/wishlist")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SavedListing[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    setItems((current) => (current ?? []).filter((i) => i.id !== id));
    await toggle(id);
  };

  return (
    <AbodeDashboardShell>
      <h1 style={{ color: DARK, fontSize: "clamp(26px, 3.6vw, 34px)", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 6px" }}>
        Saved listings
      </h1>
      <p style={{ color: MUTED, fontSize: 13.5, margin: "0 0 28px" }}>Properties you have saved for later.</p>

      {items === null && <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>}

      {items?.length === 0 && (
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 18, padding: "56px 24px", textAlign: "center" }}>
          <Heart size={26} color="#ddd" strokeWidth={1.5} />
          <p style={{ color: MUTED, fontSize: 13.5, margin: "14px 0 20px" }}>
            Nothing saved yet. Tap the heart on any property to keep it here.
          </p>
          <Link
            href="/abode/properties"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ORANGE, color: WHITE, fontSize: 13, fontWeight: 600, padding: "11px 20px", borderRadius: 999, textDecoration: "none" }}
          >
            Browse properties <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} style={{ border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden" }}>
              <Link href={`/abode/properties/${item.id}`} style={{ display: "block", textDecoration: "none" }}>
                <div style={{ position: "relative", aspectRatio: "1", background: "#f7f7f5" }}>
                  {item.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  {!item.available && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: WHITE, fontSize: 11.5 }}>Unavailable</span>
                    </div>
                  )}
                </div>
              </Link>
              <div style={{ padding: 12 }}>
                <p style={{ color: MUTED, fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>{item.city}</p>
                <Link href={`/abode/properties/${item.id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ color: DARK, fontSize: 13, fontWeight: 600, margin: "0 0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.title}
                  </h3>
                </Link>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ color: DARK, fontSize: 13.5, fontWeight: 700, margin: 0 }}>₦{item.price?.toLocaleString()}<span style={{ color: MUTED, fontWeight: 400, fontSize: 11 }}>/night</span></p>
                  {item.rating > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, color: MUTED, fontSize: 11 }}>
                      <Star size={10} fill={ORANGE} color={ORANGE} /> {item.rating}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => remove(item.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    background: WHITE, color: "#8f3a34", border: `1px solid ${LINE}`, borderRadius: 999, padding: "8px 10px",
                    fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  <Heart size={12} fill="#8f3a34" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AbodeDashboardShell>
  );
}
