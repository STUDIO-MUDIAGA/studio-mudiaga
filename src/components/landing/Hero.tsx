"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EASE = [0.76, 0, 0.24, 1] as [number, number, number, number];
const SLIDE_DURATION = 5; // seconds

const slides = [
  {
    image: "/IMG_1654.JPG",
    tag: "Furniture · Handcrafted",
    title: "Artisan\nTable",
    subtitle: "Hand-carved solid wood pieces that anchor every room with intention.",
    cta: { label: "View Collection", href: "/furniture" },
  },
  {
    image: "/IMG_1656.JPG",
    tag: "Furniture · Dining",
    title: "The Dining\nExperience",
    subtitle: "Where craftsmanship meets art — furniture that tells a story.",
    cta: { label: "Shop Furniture", href: "/furniture" },
  },
  {
    image: "/IMG_1666.JPG",
    tag: "Shortlets · Lagos",
    title: "The Media\nLounge",
    subtitle: "Curated interiors, bespoke furniture — a space designed to be lived in.",
    cta: { label: "Book Now", href: "/shortlets" },
  },
  {
    image: "/IMG_1672.JPG",
    tag: "Shortlets · Reading Nook",
    title: "Raw &\nRefined",
    subtitle: "Exposed brick, warm light, handcrafted chairs. Comfort in every detail.",
    cta: { label: "Explore Stays", href: "/shortlets" },
  },
  {
    image: "/IMG_1675.JPG",
    tag: "Shortlets · Living",
    title: "Spaces That\nInspire",
    subtitle: "Every corner considered. Every material chosen with purpose.",
    cta: { label: "Book Now", href: "/shortlets" },
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Auto-advance — resets timer on every slide change (including manual clicks)
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION * 1000);
    return () => clearInterval(timer);
  }, [active]);

  const slide = slides[active];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      data-cursor="Explore project"
    >
      {/* Slides — diagonal clip-path wipe. Active slide is always z-index 1 (on top). */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ zIndex: active === i ? 1 : 0, willChange: "clip-path" }}
            initial={false}
            animate={{
              clipPath:
                active === i
                  ? "polygon(0% 0%, 100% 0%, 100% 100%, -30% 100%)"
                  : "polygon(0% 0%, 0% 0%, -30% 100%, 0% 100%)",
            }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${s.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom-left content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-20 z-10 w-full"
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingLeft: 48, paddingRight: 48, width: "100%" }}>
          <div className="max-w-xl">
            <motion.p
              key={`tag-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/50 text-xs tracking-[0.25em] uppercase mb-5"
            >
              {slide.tag}
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${active}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-5 whitespace-pre-line"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {slide.title}
              </motion.h1>
            </AnimatePresence>

            <motion.p
              key={`sub-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/55 text-sm md:text-base leading-relaxed mb-8 max-w-sm"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href={slide.cta.href}
                className="group inline-flex items-center gap-3 text-white text-sm font-medium"
              >
                <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-200">
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
                {slide.cta.label}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Progress dots — active dot fills over SLIDE_DURATION seconds */}
      <div
        className="absolute z-20 flex items-center gap-3"
        style={{ bottom: 40, left: "50%", transform: "translateX(-50%)" }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className="relative overflow-hidden"
            style={{ width: i === active ? 48 : 28, height: 2 }}
          >
            {/* Track */}
            <span className="absolute inset-0 bg-white/25" />
            {/* Fill — keyed to active so it resets on every slide change */}
            {i === active && (
              <motion.span
                key={`fill-${active}`}
                className="absolute inset-0 bg-white"
                style={{ originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_DURATION, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
