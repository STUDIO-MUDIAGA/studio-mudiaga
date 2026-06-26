"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ORANGE = "#c46442";

const NAV = [
  { label: "Properties",   href: "/abode/properties" },
  { label: "How it works", href: "/abode/how-it-works" },
];

export default function AbodeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Navbar */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff",
        borderBottom: scrolled ? "1px solid #ebebeb" : "1px solid #f0f0f0",
        transition: "border-color 0.3s",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/abode" style={{ textDecoration: "none" }}>
            <span style={{ color: "#0a0a0a", fontSize: 18, fontWeight: 800, letterSpacing: "0.12em", lineHeight: 1, display: "block" }}>ABODE</span>
            <span style={{ color: "#bbb", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginTop: 2 }}>by Studio Mudiaga</span>
          </Link>

          {/* Center nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {NAV.map(({ label, href }) => (
              <Link key={href} href={href} style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none",
                color: pathname === href ? ORANGE : "#888",
                background: pathname === href ? "#fdf0eb" : "transparent",
                fontWeight: pathname === href ? 600 : 400,
              }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/abode/properties" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "#f7f7f5", border: "1px solid #ebebeb", color: "#888", fontSize: 12, textDecoration: "none" }}>
              <Search size={13} /> Search
            </Link>
            <Link href={user ? "/account" : "/login"} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: ORANGE, color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              <User size={13} /> {user ? "Account" : "Sign in"}
            </Link>
            <Link href="/" style={{ color: "#bbb", fontSize: 11, textDecoration: "none", marginLeft: 4 }}>
              Studio Mudiaga ↗
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #ebebeb", padding: "40px", marginTop: 80, background: "#fafaf9" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#0a0a0a", fontWeight: 800, fontSize: 14, letterSpacing: "0.1em", margin: "0 0 4px" }}>ABODE</p>
            <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>Premium shortlets across Nigeria</p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Properties",     href: "/abode/properties" },
              { label: "My Bookings",    href: "/account" },
              { label: "Studio Mudiaga", href: "/" },
              { label: "MUDRES",         href: "/mudres" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{ color: "#aaa", fontSize: 12, textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <p style={{ color: "#ccc", fontSize: 11 }}>© {new Date().getFullYear()} Studio Mudiaga</p>
        </div>
      </footer>
    </div>
  );
}
