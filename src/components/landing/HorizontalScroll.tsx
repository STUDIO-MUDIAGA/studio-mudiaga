"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Hero from "./Hero";
import { useNavTheme } from "@/context/NavTheme";

// 300vh total — hero entry (100vh) + zoom sequence (200vh)
const WRAPPER_VH = 300;

export default function HorizontalScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useNavTheme();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // dark (white logo) on hero, light (brown logo) in white panel,
    // back to dark (white logo) once image fills the screen
    if (v >= 0.85) setTheme("dark");
    else if (v >= 0.3) setTheme("light");
    else setTheme("dark");
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 18,
    mass: 0.6,
  });

  // Translation clamps at -100vw once panel is fully in view (at 40%)
  // then holds there while the zoom plays out
  const x = useTransform(
    smoothProgress,
    [0, 0.38, 1],
    ["0vw", "-100vw", "-100vw"]
  );

  return (
    <div ref={wrapperRef} style={{ height: `${WRAPPER_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x, width: "200vw" }}
        >
          {/* Panel 0 — Hero */}
          <div className="w-screen h-full flex-shrink-0">
            <Hero />
          </div>

          {/* Panel 1 — Editorial with zoom-to-fill */}
          <EditorialPanel scrollYProgress={scrollYProgress} />
        </motion.div>
      </div>
    </div>
  );
}

function EditorialPanel({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const effectiveProg = useMotionValue(0);
  // Tracks whether the image has fully filled the screen at least once.
  // Only after that do we allow smooth zoom-out on backward scroll.
  const hasFilledScreen = useRef(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const prev = scrollYProgress.getPrevious() ?? v;
    const goingForward = v >= prev;

    if (v >= 0.88) hasFilledScreen.current = true;
    if (v < 0.42)  hasFilledScreen.current = false;

    if (goingForward) {
      // Always track forward progress
      effectiveProg.set(v);
    } else if (hasFilledScreen.current) {
      // Scrolled back from full-screen → smooth zoom-out
      effectiveProg.set(v);
    } else {
      // Never reached full-screen → snap to contained, no partial reverse
      effectiveProg.set(Math.min(v, 0.42));
    }
  });

  const clipPath = useTransform(
    effectiveProg,
    [0.42, 0.88],
    ["inset(19% 29% round 2px)", "inset(0% 0% round 0px)"]
  );

  const imageScale   = useTransform(effectiveProg, [0.42, 0.88], [1.0, 1.14]);
  const textOpacity  = useTransform(effectiveProg, [0.42, 0.68], [1, 0]);
  const labelOpacity = useTransform(effectiveProg, [0.42, 0.60], [1, 0]);

  // Overlay darkens + content fades in once image fills screen
  const overlayDark    = useTransform(effectiveProg, [0.78, 0.95], [0.3, 0.68]);
  const contentOpacity = useTransform(effectiveProg, [0.86, 0.97], [0, 1]);
  const contentY       = useTransform(effectiveProg, [0.86, 0.97], [24, 0]);

  return (
    <div className="w-screen h-full flex-shrink-0 bg-white relative overflow-hidden flex items-center justify-center">

      {/* Full-bleed image revealed by clip-path */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <Image
            src="/IMG_1666.JPG"
            alt="Studio Mudiaga"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Dynamic dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayDark }}
          />
        </motion.div>
      </motion.div>

      {/* Top label (white section) */}
      <motion.p
        className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] text-[#0a0a0a]/35 tracking-[0.35em] uppercase select-none z-10"
        style={{ opacity: labelOpacity }}
      >
        Est. 2020
      </motion.p>

      {/* Left word */}
      <motion.div
        className="absolute left-14 xl:left-20 z-10 flex"
        style={{ fontFamily: "var(--font-playfair)", opacity: textOpacity }}
      >
        <ZoomText text="Project" className="text-[4.5vw] text-[#0a0a0a] font-light leading-none" />
      </motion.div>

      {/* Right word */}
      <motion.div
        className="absolute right-14 xl:right-20 z-10 flex"
        style={{ fontFamily: "var(--font-playfair)", opacity: textOpacity }}
      >
        <ZoomText text="Abode" className="text-[4.5vw] text-[#0a0a0a] font-light leading-none" />
      </motion.div>

      {/* Bottom label (white section) */}
      <motion.p
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-[#0a0a0a]/35 tracking-[0.35em] uppercase select-none z-10"
        style={{ opacity: labelOpacity }}
      >
        Lagos · Abuja
      </motion.p>

      {/* Full-screen overlay content */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Main content row — vertically centered, left edge matches navbar logo */}
        <div className="absolute inset-0 flex items-center">
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              width: "100%",
              paddingLeft: 48,
              paddingRight: 64,
              display: "flex",
              alignItems: "center",
            }}
          >
          {/* Left — oversized editorial heading */}
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(36px, 5vw, 84px)",
              fontWeight: 300,
              lineHeight: 1.04,
              color: "white",
              width: "34vw",
              flexShrink: 0,
            }}
          >
            Spaces crafted
            <br />for the way
            <br />you live.
          </h2>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Right — two paragraphs + button */}
          <div
            style={{
              width: "22vw",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                lineHeight: 1.8,
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              Studio Mudiaga brings together bespoke shortlet apartments and
              handcrafted furniture — each space considered, each detail
              purposeful.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                lineHeight: 1.8,
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              We design for real living, guided by your vision — so every room
              feels like it was made for you, because it was.
            </p>

            {/* Corner-bracket button */}
            <button
              className="relative self-start pointer-events-auto group"
              style={{
                padding: "14px 28px",
                color: "white",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans)",
                background: "transparent",
              }}
            >
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/50 group-hover:border-white transition-colors duration-300" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/50 group-hover:border-white transition-colors duration-300" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/50 group-hover:border-white transition-colors duration-300" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/50 group-hover:border-white transition-colors duration-300" />
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  background: "#c85442",
                  marginRight: 10,
                  verticalAlign: "middle",
                }}
              />
              View Project
            </button>
          </div>
          </div>
        </div>

        {/* Keep scrolling circle — bottom center */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border border-white/30 flex items-center justify-center"
        >
          <span
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 8,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.6,
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Keep<br />Scrolling
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function ZoomText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex ${className ?? ""}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", transformOrigin: "bottom center" }}
          whileHover={{ scale: 1.25, y: -10 }}
          transition={{ type: "spring", stiffness: 70, damping: 12, mass: 1.6 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
