"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from "framer-motion";
import Image from "next/image";
import { useNavTheme } from "@/context/NavTheme";

const CAROUSEL = [
  { src: "/IMG_1611.JPG", w: 360, h: 420 },
  { src: "/IMG_1613.JPG", w: 520, h: 300 },
  { src: "/IMG_1615.JPG", w: 340, h: 460 },
  { src: "/IMG_1617.JPG", w: 560, h: 340 },
  { src: "/IMG_1620.JPG", w: 360, h: 420 },
  { src: "/IMG_1623.JPG", w: 500, h: 300 },
  { src: "/IMG_1624.JPG", w: 340, h: 440 },
  { src: "/IMG_1627.JPG", w: 520, h: 320 },
  { src: "/IMG_1628.JPG", w: 360, h: 400 },
  { src: "/IMG_1629.JPG", w: 560, h: 340 },
];
export default function AboutSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useNavTheme();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start 0.25"],
  });

  const { scrollYProgress: carouselProg } = useScroll({
    target: carouselRef,
    offset: ["start end", "end start"],
  });
  const carouselX = useTransform(carouselProg, [0, 1], ["0px", "-3000px"]);

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
        {/*
          Outer grid: 2 columns
            col 1 (60%): top text row + bottom [left-img + center-text] row
            col 2 (40%): right image spanning BOTH rows — full section height
        */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gridTemplateRows: "auto minmax(52vh, 1fr)",
            minHeight: "100vh",
          }}
        >
          {/* ── Row 1 Col 1: label + heading + learn more ──────── */}
          <div
            style={{
              gridColumn: 1,
              gridRow: 1,
              padding: "clamp(36px, 4vw, 56px) clamp(28px, 3vw, 48px)",
              minHeight: "52vh",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                marginBottom: "clamp(12px, 1.4vw, 20px)",
              }}
            >
              Meet the Studio
            </p>

            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(28px, 3.8vw, 62px)",
                fontWeight: 300,
                lineHeight: 1.1,
                color: "#0a0a0a",
                maxWidth: 640,
                marginBottom: "clamp(18px, 2vw, 30px)",
              }}
            >
              Together, we shape homes rooted in
              <br />simplicity and crafted with care.
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

          {/* ── Col 2: right image spanning both rows ───────────── */}
          <div
            style={{
              gridColumn: 2,
              gridRow: "1 / 3",
              padding: "100px 28px 0 0",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
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

          {/* ── Row 2 Col 1: left image + center text ───────────── */}
          <div
            style={{
              gridColumn: 1,
              gridRow: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
            }}
          >
            {/* Left image — inset from left edge */}
            <div style={{ paddingLeft: 28, height: "100%" }}>
              <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                <Image
                  src="/IMG_1609.JPG"
                  alt="Studio Mudiaga interior"
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            </div>

            {/* Center text — aligned to bottom */}
            <div
              style={{
                padding: "clamp(28px, 3vw, 48px) clamp(28px, 3vw, 52px)",
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
          </div>
        </div>

        {/* ── Image carousel strip — scroll driven ─────────────── */}
        <div ref={carouselRef} style={{ overflow: "hidden", paddingTop: 48, paddingBottom: 48 }}>
          <motion.div
            style={{
              x: carouselX,
              display: "flex",
              gap: 8,
              width: "max-content",
              alignItems: "flex-start",
            }}
          >
            {CAROUSEL.map((img, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  position: "relative",
                  width: img.w,
                  height: img.h,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="30vw"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
