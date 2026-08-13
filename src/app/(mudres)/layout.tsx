"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { ShoppingBag, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const CREAM = "#EDE8D0";
const DARK = "#2A3812";
const SAGE = "#96B85D";

const NAV = [
  { label: "Collection", href: "/mudres/collection" },
  { label: "About", href: "/mudres/about" },
];

export default function MudresLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/mudres";
  const solid = scrolled || !isHome;

  return (
    <div className={poppins.variable} style={{ minHeight: "100vh", background: CREAM, fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
      {/* Navbar */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: solid ? "rgba(237,232,208,0.92)" : "transparent",
        backdropFilter: solid ? "blur(16px)" : "none",
        borderBottom: solid ? `1px solid rgba(42,56,18,0.08)` : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/mudres" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: solid ? DARK : CREAM, fontSize: 18, fontWeight: 700, letterSpacing: "0.18em", lineHeight: 1 }}>MUDRES</span>
              <span style={{ color: solid ? "rgba(42,56,18,0.4)" : "rgba(237,232,208,0.6)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", lineHeight: 1, marginTop: 3 }}>by Studio Mudiaga</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV.map(({ label, href }) => (
              <Link key={href} href={href} style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none",
                color: pathname.startsWith(href) ? (solid ? DARK : CREAM) : (solid ? "rgba(42,56,18,0.5)" : "rgba(237,232,208,0.55)"),
                background: pathname.startsWith(href) ? (solid ? "rgba(42,56,18,0.06)" : "rgba(237,232,208,0.12)") : "transparent",
              }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, cursor: "pointer",
              background: solid ? "rgba(42,56,18,0.05)" : "rgba(237,232,208,0.1)",
              border: solid ? "1px solid rgba(42,56,18,0.1)" : "1px solid rgba(237,232,208,0.2)",
              color: solid ? "rgba(42,56,18,0.6)" : "rgba(237,232,208,0.75)", fontSize: 12,
            }}>
              <ShoppingBag size={13} /> Cart (0)
            </button>
            <Link href={user ? "/account" : "/login"} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: SAGE, color: DARK, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              <User size={13} /> {user ? "Account" : "Sign in"}
            </Link>
            <Link href="/" style={{ color: solid ? "rgba(42,56,18,0.35)" : "rgba(237,232,208,0.4)", fontSize: 11, textDecoration: "none", marginLeft: 8 }}>
              Studio Mudiaga ↗
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer style={{ background: DARK, padding: "40px", marginTop: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: CREAM, fontWeight: 700, fontSize: 14, letterSpacing: "0.15em", margin: "0 0 4px" }}>MUDRES</p>
            <p style={{ color: "rgba(237,232,208,0.45)", fontSize: 12, margin: 0 }}>Handcrafted furniture by Studio Mudiaga</p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/mudres/collection" style={{ color: "rgba(237,232,208,0.5)", fontSize: 12, textDecoration: "none" }}>Collection</Link>
            <Link href="/account/orders" style={{ color: "rgba(237,232,208,0.5)", fontSize: 12, textDecoration: "none" }}>My Orders</Link>
            <Link href="/" style={{ color: "rgba(237,232,208,0.5)", fontSize: 12, textDecoration: "none" }}>Studio Mudiaga</Link>
            <Link href="/abode" style={{ color: "rgba(237,232,208,0.5)", fontSize: 12, textDecoration: "none" }}>ABODE</Link>
          </div>
          <p style={{ color: "rgba(237,232,208,0.3)", fontSize: 11 }}>© {new Date().getFullYear()} Studio Mudiaga</p>
        </div>
      </footer>
    </div>
  );
}
