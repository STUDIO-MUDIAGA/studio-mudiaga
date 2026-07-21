"use client";

import { motion } from "framer-motion";
import ServiceCarousel from "./ServiceCarousel";

// character-by-character rising reveal (each letter fades + rises with a back-out bounce)
const HEADING_WORDS = [
  { text: "From", italic: false },
  { text: "first", italic: false },
  { text: "sketch", italic: false },
  { text: "to", italic: false },
  { text: "final", italic: false },
  { text: "piece:", italic: false },
  { text: "considered", italic: true },
  { text: "interiors", italic: true },
  { text: "without", italic: false },
  { text: "compromise.", italic: false },
];

// cubic-bezier approximation of GSAP's back.out(1.7) overshoot
const BACK_OUT = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

function RisingWords() {
  let charIndex = 0;
  return (
    <>
      {HEADING_WORDS.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", marginRight: "0.28em" }}>
          {word.text.split("").map((char, ci) => {
            const i = charIndex++;
            return (
              <motion.span
                key={ci}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: i * 0.03, ease: BACK_OUT }}
                style={{
                  display: "inline-block",
                  fontStyle: word.italic ? "italic" : "normal",
                  fontWeight: word.italic ? 600 : 300,
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </>
  );
}

export default function BrandStatement() {
  return (
    <section
      className="bg-[#3c150a] flex flex-col items-center text-center"
      style={{
        paddingTop: "clamp(80px, 12vw, 160px)",
        paddingBottom: "clamp(56px, 8vw, 100px)",
        paddingLeft: 48,
        paddingRight: 48,
      }}
    >
      <h2
        className="text-white font-light"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(28px, 4vw, 52px)",
          lineHeight: 1.25,
          maxWidth: 920,
        }}
      >
        <RisingWords />
      </h2>

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-full border border-white/30"
        style={{ width: 14, height: 14, margin: "clamp(28px, 3vw, 40px) 0" }}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-white/60"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "clamp(14px, 1.1vw, 17px)",
          lineHeight: 1.8,
          maxWidth: 680,
        }}
      >
        Designing and building the spaces our clients live in is what sets Studio
        Mudiaga apart. We manage every stage of the process, from the first
        design brief to the last handcrafted piece delivered.
      </motion.p>

      {/* Full-bleed carousel — cancels the section's side padding */}
      <div style={{ marginTop: "clamp(56px, 7vw, 96px)", marginLeft: -48, marginRight: -48, width: "calc(100% + 96px)" }}>
        <ServiceCarousel />
      </div>
    </section>
  );
}
