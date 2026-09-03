"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag, User, ChevronDown, Menu, X, ArrowRight, ArrowUpRight,
  Sofa, Table2, Lamp, Archive, BedDouble, Flower2, LayoutGrid,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/lib/cart";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";
// Solid chrome, no translucent tints.
const PILL_BG = "#141414";
const PILL_INK = "#FFFFFF";
const PILL_MUTED = "#9C9C95";
const PILL_FAINT = "#7E7E77";
const PILL_SURFACE = "#242422";
const PILL_LINE = "#2E2E2B";
const PANEL_FILL = "#1A1A18";
const PANEL_LINE = "#2E2E2B";

/** The bar floats clear of the top edge rather than sitting flush to it. */
const INSET_Y = 14;
const INSET_X = 18;
const PILL_H = 76;
const PILL_RADIUS = 20;
/** What the page below has to clear. Exported so the hero and listing pages
 *  stay in step with the floating bar. */
export const HEADER_SPACE = INSET_Y + PILL_H;

type Item = {
  id: string;
  name: string;
  category: string | null;
  price: number | null;
  images: string[] | null;
  featured: boolean;
  in_stock: boolean;
};

/** Icon and one-line blurb per category. Categories themselves come from the
 *  catalogue, so a category with no entry here still renders with a fallback. */
const CATEGORY_META: Record<string, { icon: typeof Sofa; blurb: string }> = {
  Seating: { icon: Sofa, blurb: "Chairs, sofas and lounge pieces." },
  Tables: { icon: Table2, blurb: "Dining, coffee and side tables." },
  Lighting: { icon: Lamp, blurb: "Pendants, lamps and shades." },
  Storage: { icon: Archive, blurb: "Shelving, cabinets and consoles." },
  Bedroom: { icon: BedDouble, blurb: "Beds, frames and headboards." },
  Decor: { icon: Flower2, blurb: "Planters, ceramics and objects." },
};

const NAIRA = (n: number | null) => `₦${(n ?? 0).toLocaleString()}`;

export default function MudresHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { count: cartCount } = useCart();

  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState<"collection" | "categories" | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1000px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    fetch("/api/furniture")
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Item[]) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Body scroll lock while the mobile drawer is up.
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  // A short grace period lets the pointer cross the gap between the trigger
  // and the panel without the panel snapping shut.
  // Navigating away must never leave a panel or drawer hanging open.
  const closeAll = useCallback(() => {
    setOpen(null);
    setDrawer(false);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  }, [cancelClose]);

  const inStock = items.filter((i) => i.in_stock);
  const categories = Array.from(
    inStock.reduce((map, i) => {
      const key = i.category ?? "Other";
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);

  const featured = inStock.filter((i) => i.featured).slice(0, 4);
  const spotlight = featured[0] ?? inStock[0];

  const NAV: { label: string; href: string; panel?: "collection" | "categories" }[] = [
    { label: "Home", href: "/mudres" },
    { label: "Store", href: "/mudres/collection" },
    { label: "Collection", href: "/mudres/collection", panel: "collection" },
    { label: "Categories", href: "/mudres/collection", panel: "categories" },
  ];

  const isActive = (href: string) =>
    href === "/mudres" ? pathname === "/mudres" : pathname.startsWith(href);

  return (
    <>
      <header
        onMouseLeave={scheduleClose}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
          padding: `${INSET_Y}px ${INSET_X}px 0`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%", pointerEvents: "auto",
            padding: compact ? "0 12px 0 22px" : "0 18px 0 38px",
            height: PILL_H, display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 20,
            background: PILL_BG, border: `1px solid ${PILL_LINE}`,
            borderRadius: PILL_RADIUS,
            boxShadow: "0 14px 36px -18px rgba(0,0,0,0.4)",
          }}
        >
          {/* Wordmark */}
          <Link href="/mudres" onClick={closeAll} style={{ textDecoration: "none", flex: "0 0 auto" }}>
            <span style={{ color: PILL_INK, fontSize: compact ? 16 : 18, fontWeight: 700, letterSpacing: "0.18em", whiteSpace: "nowrap" }}>
              MUDRES
            </span>
            {!compact && (
              <span style={{ display: "block", color: PILL_FAINT, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 3, whiteSpace: "nowrap" }}>
                by Studio Mudiaga
              </span>
            )}
          </Link>

          {/* Nav */}
          {!compact && (
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {NAV.map(({ label, href, panel }) =>
                panel ? (
                  <button
                    key={label}
                    onMouseEnter={() => { cancelClose(); setOpen(panel); }}
                    onClick={() => setOpen(open === panel ? null : panel)}
                    aria-expanded={open === panel}
                    aria-haspopup="true"
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "10px 16px", borderRadius: 999, fontSize: 13.5,
                      fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                      border: open === panel ? `1px solid ${PILL_LINE}` : "1px solid transparent",
                      background: open === panel ? PILL_SURFACE : "transparent",
                      color: open === panel ? PILL_INK : PILL_MUTED,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {label}
                    <ChevronDown
                      size={13}
                      style={{ transform: open === panel ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}
                    />
                  </button>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    onClick={closeAll}
                    onMouseEnter={scheduleClose}
                    style={{
                      padding: "10px 16px", borderRadius: 999, fontSize: 13.5,
                      fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap",
                      border: "1px solid transparent",
                      color: isActive(href) && !open ? PILL_INK : PILL_MUTED,
                      background: isActive(href) && !open ? PILL_SURFACE : "transparent",
                    }}
                  >
                    {label}
                  </Link>
                )
              )}
            </nav>
          )}

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 10, flex: "0 0 auto" }}>
            <Link
              href="/mudres/cart"
              onClick={closeAll}
              aria-label="Cart"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: compact ? 0 : "11px 17px",
                width: compact ? 38 : undefined, height: compact ? 38 : undefined,
                borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none",
                background: PILL_SURFACE, border: `1px solid ${PILL_LINE}`,
                color: PILL_INK, fontSize: 12.5,
              }}
            >
              <ShoppingBag size={14} /> {!compact && `Cart (${cartCount})`}
            </Link>
            <Link
              href={user ? "/mudres/orders" : "/mudres/login"}
              aria-label={user ? "My orders" : "Sign in"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: compact ? 0 : "11px 19px",
                width: compact ? 38 : undefined, height: compact ? 38 : undefined,
                borderRadius: 999, background: WHITE, color: DARK,
                fontSize: 12.5, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
              }}
            >
              <User size={14} /> {!compact && (user ? "My orders" : "Sign in")}
            </Link>
            {compact && (
              <button
                aria-label={drawer ? "Close menu" : "Open menu"}
                onClick={() => setDrawer((d) => !d)}
                style={{
                  width: 38, height: 38, borderRadius: 999, cursor: "pointer",
                  background: "transparent", border: `1px solid ${PILL_LINE}`,
                  color: PILL_INK, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {drawer ? <X size={17} /> : <Menu size={17} />}
              </button>
            )}
          </div>
        </div>

        {/* ── Mega menu ── */}
        {!compact && open && (
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            style={{
              // Floats beneath the pill and lines up with it.
              width: "100%", margin: "10px 0 0", pointerEvents: "auto",
              background: PANEL_FILL,
              border: `1px solid ${PANEL_LINE}`,
              borderRadius: PILL_RADIUS + 2,
              boxShadow: "0 30px 60px -24px rgba(0,0,0,0.5)",
              animation: "mudresMega 0.24s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "340px 1fr",
                gap: 36,
                padding: "16px 26px 20px",
              }}
            >
              {/* Spotlight card */}
              <Link
                href={spotlight ? `/mudres/collection/${spotlight.id}` : "/mudres/collection"}
                onClick={closeAll}
                style={{
                  position: "relative", borderRadius: 18, overflow: "hidden",
                  minHeight: 300, textDecoration: "none", display: "block",
                  background: PILL_SURFACE,
                }}
              >
                {spotlight?.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={spotlight.images[0]}
                    alt={spotlight.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <div
                  style={{
                    position: "absolute", inset: 0, padding: 22,
                    display: "flex", flexDirection: "column", justifyContent: "flex-end",
                    background: "linear-gradient(to top, rgba(30,40,14,0.92) 8%, rgba(30,40,14,0.35) 55%, rgba(30,40,14,0.1) 100%)",
                  }}
                >
                  <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>
                    {open === "categories" ? "Featured piece" : "This season"}
                  </p>
                  <h3 style={{ color: WHITE, fontSize: 21, fontWeight: 700, lineHeight: 1.2, margin: "0 0 8px" }}>
                    {spotlight?.name ?? "Handcrafted for considered living"}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.55, margin: 0 }}>
                    {spotlight ? `${spotlight.category} · ${NAIRA(spotlight.price)}` : "Browse the full collection."}
                  </p>
                </div>
              </Link>

              {/* Panel body */}
              <div style={{ padding: "18px 16px 14px 4px", display: "flex", flexDirection: "column" }}>
                {open === "categories" ? (
                  <>
                    <PanelLabel>Shop by category</PanelLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {categories.map(([name, count]) => {
                        const meta = CATEGORY_META[name];
                        const Icon = meta?.icon ?? LayoutGrid;
                        return (
                          <Link
                            key={name}
                            href={`/mudres/collection?category=${encodeURIComponent(name)}`}
                            onClick={closeAll}
                            style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: 10, borderRadius: 14, textDecoration: "none",
                              border: "1px solid transparent", transition: "all 0.18s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = PILL_SURFACE;
                              e.currentTarget.style.borderColor = PANEL_LINE;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.borderColor = "transparent";
                            }}
                          >
                            <span
                              style={{
                                width: 42, height: 42, borderRadius: 12, flex: "0 0 auto",
                                background: PILL_SURFACE, border: `1px solid ${PANEL_LINE}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}
                            >
                              <Icon size={18} color={PILL_INK} strokeWidth={1.6} />
                            </span>
                            <span style={{ minWidth: 0 }}>
                              <span style={{ display: "block", color: PILL_INK, fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                                {name}
                                <span style={{ color: PILL_FAINT, fontWeight: 500 }}> ({count})</span>
                              </span>
                              <span style={{ display: "block", color: PILL_MUTED, fontSize: 12.5, lineHeight: 1.4 }}>
                                {meta?.blurb ?? "Browse this category."}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <PanelLabel>Featured pieces</PanelLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                      {featured.map((item) => (
                        <Link
                          key={item.id}
                          href={`/mudres/collection/${item.id}`}
                          onClick={closeAll}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <div style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: PILL_SURFACE, marginBottom: 8 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.images?.[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <p style={{ color: PILL_INK, fontSize: 12.5, fontWeight: 600, margin: "0 0 2px", lineHeight: 1.3 }}>{item.name}</p>
                          <p style={{ color: PILL_MUTED, fontSize: 12, margin: 0 }}>{NAIRA(item.price)}</p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {/* Footer row */}
                <div
                  style={{
                    marginTop: "auto", paddingTop: 20,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
                  }}
                >
                  <div>
                    <p style={{ color: PILL_INK, fontSize: 13.5, fontWeight: 600, margin: "0 0 3px" }}>
                      Not sure what fits your space?
                    </p>
                    <p style={{ color: PILL_MUTED, fontSize: 12.5, margin: 0 }}>
                      Talk to the studio about a made-to-order piece.
                    </p>
                  </div>
                  <Link
                    href="/book-a-consultation"
                    onClick={closeAll}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7, flex: "0 0 auto",
                      background: WHITE, color: DARK, fontSize: 12.5, fontWeight: 600,
                      padding: "11px 20px", borderRadius: 999, textDecoration: "none",
                    }}
                  >
                    Book a consultation <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile drawer ── */}
      {compact && drawer && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 55, background: WHITE,
            paddingTop: HEADER_SPACE + 8, overflowY: "auto",
            animation: "mudresDrawer 0.22s ease",
          }}
        >
          <div style={{ padding: "24px 20px 48px" }}>
            {NAV.filter((n) => !n.panel || n.panel === "collection").map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={closeAll}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 0", borderBottom: "1px solid rgba(42,56,18,0.07)",
                  color: DARK, fontSize: 20, fontWeight: 600, textDecoration: "none",
                }}
              >
                {label} <ArrowUpRight size={17} color="rgba(42,56,18,0.3)" />
              </Link>
            ))}

            <p style={{ color: "rgba(42,56,18,0.4)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", margin: "30px 0 12px" }}>
              Categories
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {categories.map(([name, count]) => {
                const Icon = CATEGORY_META[name]?.icon ?? LayoutGrid;
                return (
                  <Link
                    key={name}
                    href={`/mudres/collection?category=${encodeURIComponent(name)}`}
                    onClick={closeAll}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: 12,
                      borderRadius: 14, border: "1px solid rgba(42,56,18,0.08)",
                      textDecoration: "none", color: DARK, fontSize: 13.5, fontWeight: 600,
                    }}
                  >
                    <Icon size={17} strokeWidth={1.6} />
                    <span style={{ minWidth: 0 }}>
                      {name}
                      <span style={{ color: "rgba(42,56,18,0.35)", fontWeight: 500 }}> ({count})</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/book-a-consultation"
              onClick={closeAll}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 28, background: DARK, color: WHITE, fontSize: 13.5, fontWeight: 600,
                padding: "15px 20px", borderRadius: 999, textDecoration: "none",
              }}
            >
              Book a consultation <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}

      {/* Dim the page behind an open panel */}
      {!compact && open && (
        <div
          onMouseEnter={scheduleClose}
          style={{
            position: "fixed", inset: 0, top: HEADER_SPACE, zIndex: 40,
            background: "rgba(42,56,18,0.12)",
            animation: "mudresFade 0.24s ease",
          }}
        />
      )}

      <style>{`
        @keyframes mudresMega {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mudresFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes mudresDrawer {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: PILL_MUTED, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 14px" }}>
      {children}
    </p>
  );
}
