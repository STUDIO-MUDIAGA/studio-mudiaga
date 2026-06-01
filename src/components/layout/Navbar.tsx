"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shortlets", href: "/shortlets" },
  { label: "Furniture", href: "/furniture" },
];

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isLanding
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-white">
          studio<span className="text-amber-400">mudiaga</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                pathname === link.href
                  ? "text-amber-400"
                  : "text-white/70 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/shortlets"
            className="bg-amber-400 text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-amber-300 transition-colors"
          >
            Book Now
          </Link>
        </nav>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5 px-6 pb-6 pt-4 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "text-base font-medium transition-colors",
                  pathname === link.href ? "text-amber-400" : "text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shortlets"
              onClick={() => setMenuOpen(false)}
              className="bg-amber-400 text-black text-sm font-semibold px-5 py-2 rounded-full text-center"
            >
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
