"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import MenuOverlay from "./MenuOverlay";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          !menuOpen && (scrolled || !isLanding)
            ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div
          className="flex items-center justify-between w-full"
          style={{ maxWidth: 1200, margin: "0 auto", paddingLeft: 48, paddingRight: 64, paddingTop: 32, paddingBottom: 20 }}
        >
          {/* Left: logo + divider + subtitle */}
          <Link href="/" className="flex items-center gap-5 group">
            <Image
              src="/Group.svg"
              alt="Studio Mudiaga"
              width={180}
              height={29}
              priority
              unoptimized
            />
            <span className="w-px h-9 bg-white/20 hidden sm:block" />
            <span className="hidden sm:block text-[10px] text-white/40 tracking-[0.2em] uppercase leading-snug">
              Shortlets
              <br />
              &amp; Furniture
            </span>
          </Link>

          {/* Right: menu button only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ paddingLeft: 24, paddingRight: 20, paddingTop: 12, paddingBottom: 12, gap: 10 }}
            className="flex items-center bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 rounded-full transition-colors duration-200 z-[201] relative"
            aria-label="Toggle menu"
          >
            <span className="text-white/80 text-sm font-medium select-none tracking-wide">
              {menuOpen ? "Close" : "Menu"}
            </span>
            <span className="text-white/70 text-[18px] leading-none select-none">
              {menuOpen ? <X size={14} /> : "≡"}
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
