"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, User, ChevronDown, ArrowRight, Star, BedDouble } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resolveShortletCategoryIcon } from "@/lib/shortlet-category-icons";

const ORANGE = "#c46442";
const DARK = "#0a0a0a";
const LINE = "#ebebeb";
const MUTED = "#888888";

type Shortlet = {
  id: string; title: string; city: string; price: number;
  images: string[]; rating: number; tags: string[]; available: boolean;
};
type Category = { id: string; name: string; slug: string; color: string; icon: string; property_count: number };

export default function AbodeHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [listings, setListings] = useState<Shortlet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/shortlets")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Shortlet[]) => setListings(Array.isArray(d) ? d : []))
      .catch(() => setListings([]));
    fetch("/api/shortlets/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Category[]) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  }, [cancelClose]);

  const available = listings.filter((l) => l.available);
  const spotlight = [...available].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];

  return (
    <header
      onMouseLeave={scheduleClose}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff",
        borderBottom: scrolled || open ? "1px solid #ebebeb" : "1px solid #f0f0f0",
        transition: "border-color 0.3s",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/abode" style={{ textDecoration: "none" }} onClick={() => setOpen(false)}>
          <span style={{ color: "#0a0a0a", fontSize: 18, fontWeight: 800, letterSpacing: "0.12em", lineHeight: 1, display: "block" }}>ABODE</span>
          <span style={{ color: "#bbb", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginTop: 2 }}>by Studio Mudiaga</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            onMouseEnter={() => { cancelClose(); setOpen(true); }}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="true"
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: open || pathname.startsWith("/abode/properties") ? 600 : 400,
              cursor: "pointer", border: "none",
              color: open || pathname.startsWith("/abode/properties") ? ORANGE : "#888",
              background: open || pathname.startsWith("/abode/properties") ? "#fdf0eb" : "transparent",
            }}
          >
            Properties
            <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/abode/properties" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "#f7f7f5", border: "1px solid #ebebeb", color: "#888", fontSize: 12, textDecoration: "none" }}>
            <Search size={13} /> Search
          </Link>
          <Link
            href={user ? "/account" : `/login?next=${encodeURIComponent(pathname)}`}
            onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: ORANGE, color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
          >
            <User size={13} /> {user ? "Account" : "Sign in"}
          </Link>
          <Link href="/" style={{ color: "#bbb", fontSize: 11, textDecoration: "none", marginLeft: 4 }}>
            Studio Mudiaga ↗
          </Link>
        </div>
      </div>

      {/* ── Mega menu ── */}
      {open && (
        <div
          onMouseEnter={cancelClose}
          style={{
            borderTop: `1px solid ${LINE}`,
            background: "#fff",
            boxShadow: "0 20px 50px -20px rgba(0,0,0,0.12)",
            animation: "abodeMega 0.2s ease",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 40px 32px", display: "grid", gridTemplateColumns: "320px 1fr", gap: 40 }}>
            {/* Spotlight card */}
            <Link
              href={spotlight ? `/abode/properties/${spotlight.id}` : "/abode/properties"}
              onClick={() => setOpen(false)}
              style={{ position: "relative", borderRadius: 16, overflow: "hidden", minHeight: 260, textDecoration: "none", display: "block", background: "#f7f7f5" }}
            >
              {spotlight?.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={spotlight.images[0]} alt={spotlight.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BedDouble size={32} color="#ddd" />
                </div>
              )}
              <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "linear-gradient(to top, rgba(10,10,10,0.85) 10%, rgba(10,10,10,0.25) 60%, rgba(10,10,10,0) 100%)" }}>
                <p style={{ color: ORANGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 6px" }}>
                  {spotlight?.rating ? "Top rated stay" : "Featured stay"}
                </p>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, lineHeight: 1.25, margin: "0 0 6px" }}>
                  {spotlight?.title ?? "Find your next short stay"}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12.5, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  {spotlight ? (
                    <>
                      <Star size={11} fill={ORANGE} color={ORANGE} /> {spotlight.rating} · {spotlight.city} · ₦{spotlight.price.toLocaleString()}/night
                    </>
                  ) : (
                    "Browse verified shortlets across Nigeria."
                  )}
                </p>
              </div>
            </Link>

            {/* Categories */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ color: MUTED, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>
                Browse by category
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {categories.map((c) => {
                  const Icon = resolveShortletCategoryIcon(c.icon);
                  return (
                    <Link
                      key={c.id}
                      href={`/abode/properties?category=${encodeURIComponent(c.slug)}`}
                      onClick={() => setOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 14, textDecoration: "none", border: "1px solid transparent", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fafaf9"; e.currentTarget.style.borderColor = LINE; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                    >
                      <span style={{ width: 38, height: 38, borderRadius: 11, flex: "0 0 auto", background: c.color + "14", border: `1px solid ${c.color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={16} color={c.color} strokeWidth={1.8} />
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: "block", color: DARK, fontSize: 13.5, fontWeight: 600 }}>
                          {c.name} <span style={{ color: "#bbb", fontWeight: 500 }}>({c.property_count})</span>
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Footer row */}
              <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                <div>
                  <p style={{ color: DARK, fontSize: 13, fontWeight: 600, margin: "0 0 3px" }}>Looking for something specific?</p>
                  <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Search all verified shortlets across Nigeria.</p>
                </div>
                <Link
                  href="/abode/properties"
                  onClick={() => setOpen(false)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, flex: "0 0 auto", background: ORANGE, color: "#fff", fontSize: 12.5, fontWeight: 600, padding: "10px 18px", borderRadius: 999, textDecoration: "none" }}
                >
                  View all properties <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes abodeMega { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
}
