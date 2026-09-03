"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import MudresHeader from "@/components/mudres/MudresHeader";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const CREAM = "#EDE8D0";
const WHITE = "#FFFFFF";
const DARK = "#2A3812";


export default function MudresLayout({ children }: { children: React.ReactNode }) {

  const [compact, setCompact] = useState(false);

  // Below this the navbar drops its wordmark strapline, the cross-brand link
  // and the button labels, so the row still fits on a phone.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className={poppins.variable} style={{ minHeight: "100vh", background: WHITE, fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
      <MudresHeader />

      <main>{children}</main>

      {/* Footer */}
      <footer style={{ background: DARK, padding: compact ? "32px 20px" : "40px", marginTop: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: compact ? "column" : "row", alignItems: compact ? "flex-start" : "center", justifyContent: "space-between", gap: compact ? 24 : 0 }}>
          <div>
            <p style={{ color: CREAM, fontWeight: 700, fontSize: 14, letterSpacing: "0.15em", margin: "0 0 4px" }}>MUDRES</p>
            <p style={{ color: "rgba(237,232,208,0.45)", fontSize: 12, margin: 0 }}>Handcrafted furniture by Studio Mudiaga</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? 16 : 24 }}>
            <Link href="/mudres/collection" style={{ color: "rgba(237,232,208,0.5)", fontSize: 12, textDecoration: "none" }}>Collection</Link>
            <Link href="/mudres/orders" style={{ color: "rgba(237,232,208,0.5)", fontSize: 12, textDecoration: "none" }}>My Orders</Link>
            <Link href="/" style={{ color: "rgba(237,232,208,0.5)", fontSize: 12, textDecoration: "none" }}>Studio Mudiaga</Link>
            <Link href="/abode" style={{ color: "rgba(237,232,208,0.5)", fontSize: 12, textDecoration: "none" }}>ABODE</Link>
          </div>
          <p style={{ color: "rgba(237,232,208,0.3)", fontSize: 11 }}>© {new Date().getFullYear()} Studio Mudiaga</p>
        </div>
      </footer>
    </div>
  );
}
