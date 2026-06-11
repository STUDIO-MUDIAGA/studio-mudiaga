"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const MARQUEE_ITEMS = [
  "Shortlet Apartments",
  "Bespoke Furniture",
  "Curated Living",
  "Studio Mudiaga",
  "Lagos & Abuja",
  "Designed With Care",
];

// doubled for seamless loop
const MARQUEE_DOUBLED = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function AboutSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start 0.25"],
  });

  const smoothProg = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.8 });

  // section zooms + rises up from below as it enters
  const scale = useTransform(smoothProg, [0, 1], [0.88, 1]);
  const y = useTransform(smoothProg, [0, 1], [72, 0]);
  const borderRadius = useTransform(smoothProg, [0, 1], [28, 0]);

  return (
    <div ref={wrapperRef}>
      <motion.section
        className="relative min-h-screen bg-[#0c0c0a] overflow-hidden"
        style={{ scale, y, borderRadius, transformOrigin: "center top" }}
      >
        {/* ── Marquee ─────────────────────────────────────────────── */}
        <div className="overflow-hidden border-b border-white/8 py-7">
          <motion.div
            className="flex items-center"
            style={{ whiteSpace: "nowrap" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {MARQUEE_DOUBLED.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 pr-6">
                <span
                  className="text-white/80 italic"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(28px, 4vw, 60px)",
                    fontWeight: 300,
                  }}
                >
                  {item}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                  }}
                />
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── About body ──────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            paddingLeft: 48,
            paddingRight: 64,
          }}
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mt-20 mb-16">
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                background: "#c85442",
                borderRadius: "50%",
              }}
            />
            <span
              className="text-white/40 tracking-[0.3em] uppercase"
              style={{ fontSize: 10, fontFamily: "var(--font-dm-sans)" }}
            >
              About Studio
            </span>
          </div>

          {/* Body paragraph */}
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(22px, 2.6vw, 42px)",
              fontWeight: 300,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 820,
            }}
          >
            Studio Mudiaga is a Lagos-based{" "}
            <em>design-led living studio</em> — shaping spaces through
            handcrafted furniture and{" "}
            <em>curated shortlet apartments</em> that feel intentional from
            every angle.
          </p>

          {/* Divider */}
          <div className="border-t border-white/8 mt-20 mb-16" />

          {/* Two-column categories */}
          <div className="grid grid-cols-2 gap-8 pb-24">
            {[
              {
                index: "01",
                title: "Shortlet Apartments",
                body: "Fully furnished, design-forward spaces in Lagos and Abuja — available for short and extended stays.",
              },
              {
                index: "02",
                title: "Bespoke Furniture",
                body: "Handcrafted pieces built to last. Each item designed around the space it will live in.",
              },
            ].map((item) => (
              <div key={item.index}>
                <p
                  className="text-white/20 mb-6"
                  style={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", letterSpacing: "0.2em" }}
                >
                  {item.index}
                </p>
                <h3
                  className="text-white mb-4"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(20px, 2vw, 32px)",
                    fontWeight: 300,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-white/40 leading-relaxed"
                  style={{ fontSize: 14, fontFamily: "var(--font-dm-sans)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
