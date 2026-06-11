"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from "framer-motion";
import { useEffect } from "react";
import { useNavTheme } from "@/context/NavTheme";

const PILLARS = [
  {
    icon: (
      <svg width="72" height="44" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 34 C10 18 20 38 30 26 C38 16 44 32 54 22 C60 16 64 24 68 20" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <path d="M4 34 C6 30 4 28 7 26" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    title: "Culturally Grounded",
    body: "Great design draws from history, identity, and the rhythms of African life. Every space we create is an act of cultural expression, not just decoration.",
  },
  {
    icon: (
      <svg width="72" height="44" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 36 Q14 10 36 10 Q58 10 58 36" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <line x1="8" y1="36" x2="64" y2="36" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
    title: "Artistic & Intentional",
    body: "Every room has a story waiting to be told. We design with purpose and precision, layering meaning into every material, every form, and every finish until the space speaks for itself.",
  },
  {
    icon: (
      <svg width="72" height="44" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 30 C16 30 26 12 44 20 C54 24 62 18 66 14" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <path d="M58 10 L66 14 L60 20" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: "Client-Centered",
    body: "Your vision is our starting point. We listen deeply, collaborate closely, and translate who you are into environments that feel personal, elevated, and unmistakably yours.",
  },
];

export default function AboutSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useNavTheme();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start 0.25"],
  });

  const smoothProg = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.8 });

  useMotionValueEvent(smoothProg, "change", (v) => {
    if (v >= 0.88) setTheme("light");
  });

  const isInView = useInView(wrapperRef, { margin: "-5% 0px -5% 0px" });
  useEffect(() => {
    if (!isInView) setTheme("dark");
  }, [isInView, setTheme]);

  const scale        = useTransform(smoothProg, [0, 1], [0.88, 1]);
  const y            = useTransform(smoothProg, [0, 1], [72, 0]);
  const borderRadius = useTransform(smoothProg, [0, 1], [28, 0]);

  return (
    <div ref={wrapperRef}>
      <motion.section
        className="relative bg-[#f8f7f4] overflow-hidden"
        style={{ scale, y, borderRadius, transformOrigin: "center top" }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            paddingLeft: 48,
            paddingRight: 64,
          }}
        >
          {/* ── Headline ──────────────────────────────────────────── */}
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(28px, 3.4vw, 62px)",
              fontWeight: 300,
              lineHeight: 1.1,
              color: "#0a0a0a",
              paddingTop: "clamp(36px, 4vw, 60px)",
              paddingBottom: "clamp(24px, 2.5vw, 40px)",
              maxWidth: 820,
            }}
          >
            Defined by warmth,
            <br />simplicity and
            <br />intentional craft.
          </h2>

          {/* ── Divider ───────────────────────────────────────────── */}
          <div style={{ borderTop: "1px solid rgba(10,10,10,0.12)", marginBottom: "clamp(20px, 2.2vw, 36px)" }} />

          {/* ── Two-column body ───────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "clamp(24px, 3vw, 64px)",
              paddingBottom: "clamp(28px, 3vw, 48px)",
            }}
          >
            {/* Left — label */}
            <div style={{ paddingTop: 4 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#0a0a0a",
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    background: "#0a0a0a",
                    flexShrink: 0,
                  }}
                />
                About Studio
              </span>
            </div>

            {/* Right — paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "clamp(12px, 1vw, 15px)",
                  lineHeight: 1.8,
                  color: "rgba(10,10,10,0.7)",
                }}
              >
                Studiomudiaga is a contemporary African design brand that
                transforms both personal and professional spaces — blending
                minimalism, culture, and soul into environments that function
                beautifully and feel unforgettable.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "clamp(12px, 1vw, 15px)",
                  lineHeight: 1.8,
                  color: "rgba(10,10,10,0.7)",
                }}
              >
                Founded by Mudiaga, the brand emerged from a personal journey
                of longing for spaces that reflect clarity, identity, and
                intention.
              </p>
            </div>
          </div>

          {/* ── Divider ───────────────────────────────────────────── */}
          <div style={{ borderTop: "1px solid rgba(10,10,10,0.12)", marginBottom: "clamp(28px, 3vw, 48px)" }} />

          {/* ── Three pillars ─────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(24px, 3vw, 48px)",
              paddingBottom: "clamp(48px, 5vw, 80px)",
            }}
          >
            {PILLARS.map((p) => (
              <div key={p.title} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ height: 40 }}>{p.icon}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "clamp(12px, 0.9vw, 15px)",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                      color: "#0a0a0a",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "clamp(11px, 0.8vw, 13px)",
                      lineHeight: 1.8,
                      color: "rgba(10,10,10,0.55)",
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
