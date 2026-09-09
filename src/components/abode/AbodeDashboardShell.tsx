"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid, CalendarDays, Heart, MessageCircle, Building2, LogOut, Settings, Search, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const WHITE = "#FFFFFF";
const DARK = "#0a0a0a";
const ORANGE = "#c46442";
const MUTED = "#888888";
const LINE = "#ebebeb";
const SURFACE = "#f7f7f5";

/** Mirrors MUDRES's DashboardShell/IN_SHELL_NAV. Properties browsing is
 *  deliberately outside the shell — same reasoning as MUDRES's Shop/Cart:
 *  it's a full-width storefront flow, not a dashboard subpage. */
const IN_SHELL_NAV = [
  { label: "Home", href: "/account", icon: LayoutGrid },
  { label: "My Bookings", href: "/account/bookings", icon: CalendarDays },
  { label: "Saved listings", href: "/account/saved", icon: Heart },
  { label: "Chat with us", href: "/account/support", icon: MessageCircle },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

function NavIcon({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      style={{
        width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        flex: "0 0 auto", background: active ? ORANGE : "transparent", color: active ? WHITE : MUTED,
      }}
    >
      {children}
    </span>
  );
}

export default function AbodeDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  if (loading || !user) {
    return (
      <div style={{ background: WHITE, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: MUTED, fontSize: 13 }}>Loading your account…</p>
      </div>
    );
  }

  const initial = (profile?.full_name || user.email || "?").trim().charAt(0).toUpperCase();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/abode/properties?q=${encodeURIComponent(q)}` : "/abode/properties");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: WHITE }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex"
        style={{
          width: 240, flexShrink: 0, flexDirection: "column", background: WHITE,
          borderRight: `1px solid ${LINE}`, height: "100vh", position: "sticky", top: 0, padding: "22px 14px",
        }}
      >
        <div style={{ padding: "0 8px", marginBottom: 24 }}>
          <span style={{ color: DARK, fontSize: 14, fontWeight: 800, letterSpacing: "0.12em", lineHeight: 1, display: "block" }}>ABODE</span>
          <span style={{ color: "#bbb", fontSize: 8.5, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginTop: 3 }}>by Studio Mudiaga</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {IN_SHELL_NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 9px", borderRadius: 11,
                  textDecoration: "none", fontSize: 13.5, fontWeight: 500, color: active ? DARK : MUTED,
                }}
              >
                <NavIcon active={active}>
                  <Icon size={14.5} strokeWidth={1.8} />
                </NavIcon>
                {label}
              </Link>
            );
          })}

          <div style={{ height: 1, background: LINE, margin: "12px 5px" }} />

          <Link
            href="/abode/properties"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 9px", borderRadius: 11, textDecoration: "none", fontSize: 13.5, fontWeight: 500, color: MUTED }}
          >
            <NavIcon active={false}>
              <Building2 size={14.5} strokeWidth={1.8} />
            </NavIcon>
            Browse properties
          </Link>
        </nav>

        <button
          onClick={() => signOut().then(() => router.push("/abode"))}
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 9px", borderRadius: 11,
            border: "none", background: "transparent", cursor: "pointer", marginTop: 6,
            fontSize: 13.5, fontWeight: 500, color: MUTED, textAlign: "left", fontFamily: "inherit",
          }}
        >
          <NavIcon active={false}>
            <LogOut size={14.5} strokeWidth={1.8} />
          </NavIcon>
          Sign out
        </button>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 28px", borderBottom: `1px solid ${LINE}`, flexShrink: 0 }}>
          <form onSubmit={submitSearch} style={{ position: "relative", flex: 1, maxWidth: 340 }}>
            <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: MUTED, pointerEvents: "none" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties…"
              style={{
                width: "100%", background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 10,
                padding: "9px 12px 9px 34px", color: DARK, fontSize: 12.5, outline: "none",
                boxSizing: "border-box", fontFamily: "inherit",
              }}
            />
          </form>

          <div ref={menuRef} style={{ position: "relative", flex: "0 0 auto" }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none",
                cursor: "pointer", padding: 0, fontFamily: "inherit",
              }}
            >
              <span className="hidden sm:block" style={{ textAlign: "right" }}>
                <p style={{ color: DARK, fontSize: 12.5, fontWeight: 600, margin: 0, lineHeight: 1.3, whiteSpace: "nowrap" }}>
                  {profile?.full_name || "My account"}
                </p>
                <p style={{ color: MUTED, fontSize: 11, margin: 0, lineHeight: 1.3, whiteSpace: "nowrap" }}>{user.email}</p>
              </span>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: ORANGE, color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, flex: "0 0 auto" }}>
                {initial}
              </span>
              <ChevronDown size={14} color={MUTED} style={{ flex: "0 0 auto", transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 200, background: WHITE,
                  border: `1px solid ${LINE}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  padding: 6, zIndex: 50,
                }}
              >
                <div style={{ padding: "8px 10px 10px", borderBottom: `1px solid ${LINE}`, marginBottom: 6 }}>
                  <p style={{ color: DARK, fontSize: 12.5, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                    {profile?.full_name || "My account"}
                  </p>
                  <p style={{ color: MUTED, fontSize: 11, margin: "2px 0 0", lineHeight: 1.3, wordBreak: "break-all" }}>{user.email}</p>
                </div>
                <Link
                  href="/account/settings"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 500, color: DARK }}
                >
                  <Settings size={14.5} strokeWidth={1.8} /> Account settings
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut().then(() => router.push("/abode")); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, width: "100%",
                    border: "none", background: "transparent", cursor: "pointer", textAlign: "left",
                    fontSize: 13, fontWeight: 500, color: "#B3261E", fontFamily: "inherit",
                  }}
                >
                  <LogOut size={14.5} strokeWidth={1.8} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Mobile tab strip */}
        <nav
          className="flex md:hidden"
          style={{ gap: 6, overflowX: "auto", padding: "12px 16px", borderBottom: `1px solid ${LINE}`, WebkitOverflowScrolling: "touch", flexShrink: 0 }}
        >
          {[...IN_SHELL_NAV,
            { label: "Browse", href: "/abode/properties", icon: Building2 },
          ].map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto",
                  padding: "8px 13px", borderRadius: 999, textDecoration: "none",
                  fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                  background: active ? ORANGE : SURFACE, color: active ? WHITE : MUTED,
                }}
              >
                <Icon size={13} strokeWidth={2} /> {label}
              </Link>
            );
          })}
        </nav>

        <main style={{ flex: 1, padding: "28px 32px" }}>{children}</main>
      </div>
    </div>
  );
}
