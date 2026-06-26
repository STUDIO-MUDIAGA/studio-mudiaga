"use client";

import Link from "next/link";

interface Props {
  image: string;
  quote: string;
  tagline?: string;
  topRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthSplitLayout({ image, quote, tagline, topRight, children }: Props) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#0c0c0c" }}>
      {/* Left panel — image */}
      <div style={{ display: "none", position: "relative", overflow: "hidden", flexShrink: 0, width: "45%" }} className="auth-left-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, padding: 40 }}>
          <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, lineHeight: 1.3, marginBottom: 8, maxWidth: 320 }}>{quote}</p>
          {tagline && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, maxWidth: 280 }}>{tagline}</p>}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0c0c0c", overflowY: "auto" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", flexShrink: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Group.svg" alt="Studio Mudiaga" width={28} height={28} style={{ filter: "invert(1)" }} />
          </Link>
          <div>{topRight}</div>
        </div>

        {/* Form — centered */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 48px" }}>
          <div style={{ width: "100%", maxWidth: 400 }}>{children}</div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", flexShrink: 0 }}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>© 2025 Studio Mudiaga</p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/privacy-policy" style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textDecoration: "none" }}>Terms</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .auth-left-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
}
