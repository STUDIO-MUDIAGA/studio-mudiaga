"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid, Package, Heart, ShoppingBag, MessageCircle, Store, LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/lib/cart";
import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const MUTED = "#6F7A5E";
const LINE = "#E7E8E0";
const SURFACE = "#F5F5F1";

/** Pages that live inside the sidebar shell. Shop and Cart are deliberately
 *  outside it: the storefront and checkout are full-width flows, not
 *  dashboard subpages, so clicking them just navigates away from the shell. */
const IN_SHELL_NAV = [
  { label: "Home", href: "/mudres/dashboard", icon: LayoutGrid },
  { label: "Orders", href: "/mudres/orders", icon: Package },
  { label: "Wishlist", href: "/mudres/dashboard/wishlist", icon: Heart },
  { label: "Chat with us", href: "/mudres/dashboard/support", icon: MessageCircle },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const { count: cartCount } = useCart();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/mudres/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div style={{ background: WHITE, minHeight: "100vh", paddingTop: HEADER_SPACE }}>
        <div style={{ padding: "80px 20px", textAlign: "center", color: MUTED, fontSize: 13 }}>
          Loading your account…
        </div>
      </div>
    );
  }

  const initial = (profile?.full_name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div style={{ background: WHITE, minHeight: "100vh", paddingTop: HEADER_SPACE }}>
      <div
        className="px-5 md:px-10"
        style={{
          maxWidth: 1280, margin: "0 auto", paddingTop: 28, paddingBottom: 80,
          display: "grid", gridTemplateColumns: "240px 1fr", gap: 36, alignItems: "start",
        }}
      >
        {/* Sidebar */}
        <aside className="hidden md:block" style={{ position: "sticky", top: HEADER_SPACE + 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span
              style={{
                width: 38, height: 38, borderRadius: "50%", background: DARK, color: WHITE,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, flex: "0 0 auto",
              }}
            >
              {initial}
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: DARK, fontSize: 13.5, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile?.full_name || "My account"}
              </p>
              <p style={{ color: MUTED, fontSize: 11.5, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </p>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {IN_SHELL_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 11, textDecoration: "none",
                    fontSize: 13.5, fontWeight: 500,
                    background: active ? SURFACE : "transparent",
                    color: active ? DARK : MUTED,
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} /> {label}
                </Link>
              );
            })}

            <div style={{ height: 1, background: LINE, margin: "10px 0" }} />

            <Link
              href="/mudres/collection"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, textDecoration: "none", fontSize: 13.5, fontWeight: 500, color: MUTED }}
            >
              <Store size={16} strokeWidth={1.8} /> Shop
            </Link>
            <Link
              href="/mudres/cart"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 12px", borderRadius: 11, textDecoration: "none", fontSize: 13.5, fontWeight: 500, color: MUTED }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShoppingBag size={16} strokeWidth={1.8} /> Cart
              </span>
              {cartCount > 0 && (
                <span style={{ background: DARK, color: WHITE, fontSize: 10.5, fontWeight: 700, borderRadius: 999, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <div style={{ height: 1, background: LINE, margin: "10px 0" }} />

            <button
              onClick={() => signOut().then(() => router.push("/mudres"))}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11,
                border: "none", background: "transparent", cursor: "pointer",
                fontSize: 13.5, fontWeight: 500, color: MUTED, textAlign: "left", fontFamily: "inherit",
              }}
            >
              <LogOut size={16} strokeWidth={1.8} /> Sign out
            </button>
          </nav>
        </aside>

        {/* Mobile tab strip */}
        <nav
          className="md:hidden"
          style={{
            gridColumn: "1 / -1", display: "flex", gap: 6, overflowX: "auto",
            paddingBottom: 4, marginBottom: 4, WebkitOverflowScrolling: "touch",
          }}
        >
          {[...IN_SHELL_NAV,
            { label: "Shop", href: "/mudres/collection", icon: Store },
            { label: "Cart", href: "/mudres/cart", icon: ShoppingBag },
          ].map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto",
                  padding: "9px 14px", borderRadius: 999, textDecoration: "none",
                  fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
                  background: active ? DARK : SURFACE,
                  color: active ? WHITE : MUTED,
                }}
              >
                <Icon size={13} strokeWidth={2} /> {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
