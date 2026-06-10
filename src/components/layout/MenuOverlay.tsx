"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const navItems = [
  { label: "About Us",     href: "/about"     },
  { label: "Portfolio",    href: "/portfolio" },
  { label: "Studio",       href: "/studio"    },
  { label: "Book Us Now",  href: "/book"      },
];

const leftImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80", // repeat for seamless loop
];

const rightImages = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80", // repeat for seamless loop
];

const EASE = [0.76, 0, 0.24, 1] as [number, number, number, number];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MenuOverlay({ open, onClose }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* ── Left image column ── */}
          <div className="hidden lg:block w-[27%] overflow-hidden relative" style={{ backgroundColor: "#111111" }}>
            <motion.div
              className="flex flex-col gap-3 p-3"
              animate={{ y: ["0%", "-25%"] }}
              transition={{ duration: 22, repeat: Infinity, repeatType: "loop", ease: "linear" }}
            >
              {leftImages.map((src, i) => (
                <div key={i} className="relative w-full overflow-hidden rounded-sm" style={{ height: "34vh" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Center nav panel ── */}
          <div className="flex-1 flex flex-col relative overflow-hidden" style={{ backgroundColor: "#111111" }}>

            {/* Grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
              }}
            />

            {/* menu_nav-top: logo centered */}
            <motion.div
              className="flex justify-center"
              style={{ paddingTop: 80, paddingBottom: 8 }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
            >
              <Link href="/" onClick={onClose}>
                <Image src="/Group.svg" alt="Studio Mudiaga" width={160} height={26} unoptimized priority />
              </Link>
            </motion.div>

            {/* nav — vertically centered */}
            <nav className="flex-1 flex flex-col justify-center px-10 lg:px-14">
              <ul className="w-full">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 + i * 0.07, duration: 0.55, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      className="group relative block w-full"
                    >
                      <motion.div
                        className="h-px w-full bg-white/50 origin-left"
                        animate={{ scaleX: hovered === i ? 1 : 0, opacity: hovered === i ? 1 : 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      />
                      <div className="py-5 lg:py-7 text-center">
                        <span
                          className="font-semibold uppercase text-white/65 group-hover:text-white transition-colors duration-300"
                          style={{ fontFamily: "var(--font-dm-sans)", fontSize: 28, letterSpacing: "0.03em" }}
                        >
                          {item.label}
                        </span>
                      </div>
                      <motion.div
                        className="h-px w-full bg-white/50 origin-left"
                        animate={{ scaleX: hovered === i ? 1 : 0, opacity: hovered === i ? 1 : 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* social icons + copyright — pinned to bottom */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.45 }}
              style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40, paddingTop: 24 }}
            >
              <div className="flex items-center justify-center gap-4" style={{ marginBottom: 16 }}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all">
                  <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all">
                  <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-white/30 text-center">
                © {new Date().getFullYear()} Studio Mudiaga
              </p>
            </motion.div>

          </div>

          {/* ── Right image column ── */}
          <div className="hidden lg:block w-[27%] overflow-hidden relative" style={{ backgroundColor: "#111111" }}>
            {/* Close button — top-right corner */}
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="absolute top-8 right-8 z-10 w-11 h-11 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
              aria-label="Close menu"
            >
              <X size={17} />
            </motion.button>

            <motion.div
              className="flex flex-col gap-3 p-3"
              animate={{ y: ["0%", "-25%"] }}
              transition={{ duration: 28, repeat: Infinity, repeatType: "loop", ease: "linear" }}
            >
              {rightImages.map((src, i) => (
                <div key={i} className="relative w-full overflow-hidden rounded-sm" style={{ height: "34vh" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
