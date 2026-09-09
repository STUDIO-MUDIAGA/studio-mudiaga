import Link from "next/link";
import AbodeHeader from "@/components/abode/AbodeHeader";

export default function AbodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <AbodeHeader />

      <main>{children}</main>

      {/* Footer */}
      <footer className="px-5 md:px-10" style={{ borderTop: "1px solid #ebebeb", paddingTop: 32, paddingBottom: 32, marginTop: 80, background: "#fafaf9" }}>
        <div className="flex flex-col sm:flex-row sm:items-center" style={{ maxWidth: 1280, margin: "0 auto", justifyContent: "space-between", gap: 20, textAlign: "center" }}>
          <div>
            <p style={{ color: "#0a0a0a", fontWeight: 800, fontSize: 14, letterSpacing: "0.1em", margin: "0 0 4px" }}>ABODE</p>
            <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>Premium shortlets across Nigeria</p>
          </div>
          <div className="flex flex-wrap justify-center" style={{ gap: 18 }}>
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
