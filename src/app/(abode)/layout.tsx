"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { label: "Properties", href: "/abode/properties" },
  { label: "How it works", href: "/abode/how-it-works" },
];

export default function AbodeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isHome = pathname === "/abode";

  return (
    <div style={{ minHeight: "100vh", background: "#080c10" }}>
      {/* Navbar */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled || !isHome ? "rgba(8,12,16,0.92)" : "transparent",
        backdropFilter: scrolled || !isHome ? "blur(16px)" : "none",
        borderBottom: scrolled || !isHome ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/abode" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#fff", fontSize: 18, fontWeight: 800, letterSpacing: "0.12em", lineHeight: 1 }}>ABODE</span>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", lineHeight: 1, marginTop: 3 }}>by Studio Mudiaga</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV.map(({ label, href }) => (
              <Link key={href} href={href} style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none",
                color: pathname === href ? "#fff" : "rgba(255,255,255,0.4)",
                background: pathname === href ? "rgba(255,255,255,0.06)" : "transparent",
              }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/abode/properties" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: 12, textDecoration: "none" }}>
              <Search size={13} /> Search
            </Link>
            <Link href={user ? "/account" : "/login"} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: "#c49a3c", color: "#000", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              <User size={13} /> {user ? "Account" : "Sign in"}
            </Link>
            <Link href="/" style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textDecoration: "none", marginLeft: 8, padding: "4px 0" }}>
              Studio Mudiaga ↗
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px", marginTop: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", margin: "0 0 4px" }}>ABODE</p>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, margin: 0 }}>Premium shortlets across Nigeria</p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/abode/properties" style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "none" }}>Properties</Link>
            <Link href="/account" style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "none" }}>My Bookings</Link>
            <Link href="/" style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "none" }}>Studio Mudiaga</Link>
            <Link href="/mudres" style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "none" }}>MUDRES</Link>
          </div>
          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>© {new Date().getFullYear()} Studio Mudiaga</p>
        </div>
      </footer>
    </div>
  );
}
