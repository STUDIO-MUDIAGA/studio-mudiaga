"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from "framer-motion";
import Image from "next/image";
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
        style={{
          scale,
          y,
          borderRadius,
          transformOrigin: "center top",
          background: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* ── Top: label + heading + learn more ──────────────── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            paddingLeft: 48,
            paddingRight: 64,
            paddingTop: "clamp(48px, 5vw, 80px)",
            paddingBottom: "clamp(32px, 3.5vw, 56px)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              marginBottom: "clamp(14px, 1.6vw, 24px)",
            }}
          >
            Meet the Studio
          </p>

          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(32px, 4.2vw, 70px)",
              fontWeight: 300,
              lineHeight: 1.08,
              color: "#0a0a0a",
              maxWidth: 700,
              marginBottom: "clamp(20px, 2.2vw, 36px)",
            }}
          >
            Defined by warmth,
            <br />simplicity and intentionality.
          </h2>

          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-dm-sans)",
              fontSize: 13,
              color: "#0a0a0a",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            Learn more
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l5 4-5 4" stroke="#0a0a0a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* ── Bottom: left photo | center text | right photo ──── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr 1.6fr",
            minHeight: "58vh",
          }}
        >
          {/* Left — portrait room photo */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <Image
              src="/IMG_1609.JPG"
              alt="Studio Mudiaga interior"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>

          {/* Center — body copy, aligned to bottom */}
          <div
            style={{
              padding: "clamp(32px, 3.5vw, 56px) clamp(28px, 3vw, 52px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 24,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "clamp(12px, 1vw, 15px)",
                lineHeight: 1.85,
                color: "rgba(10,10,10,0.65)",
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
                lineHeight: 1.85,
                color: "rgba(10,10,10,0.65)",
              }}
            >
              Founded by Mudiaga, the brand emerged from a personal journey
              of longing for spaces that reflect clarity, identity, and intention.
            </p>
          </div>

          {/* Right — tall image with founder tag */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <Image
              src="/IMG_1672.JPG"
              alt="Mudiaga — Founder"
              fill
              className="object-cover"
              sizes="40vw"
            />
            {/* + marker */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                color: "white",
                fontSize: 26,
                fontWeight: 200,
                lineHeight: 1,
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              +
            </div>
            {/* MUDIAGA | FOUNDER — vertical right edge */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.75)",
                  transform: "rotate(90deg)",
                  whiteSpace: "nowrap",
                }}
              >
                Mudiaga | Founder
              </span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
