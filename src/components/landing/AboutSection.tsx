"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from "framer-motion";
import { useEffect } from "react";
import { useNavTheme } from "@/context/NavTheme";


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
        style={{ scale, y, borderRadius, transformOrigin: "center top", minHeight: "100vh" }}
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
            <br />simplicity and intentionality.
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
                transforms both personal and professional spaces, blending
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

        </div>
      </motion.section>
    </div>
  );
}
