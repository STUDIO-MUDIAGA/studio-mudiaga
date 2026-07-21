"use client";

import { motion } from "framer-motion";

const WORDS = [
  "Designers",
  "Builders",
  "Studio Mudiaga",
  "Interior Architects",
  "Furniture Makers",
  "Craftsmanship",
];

// duplicated so the loop can wrap seamlessly at -50%
const LOOP_WORDS = [...WORDS, ...WORDS];

export default function IdentityMarquee() {
  return (
    <section
      className="bg-white flex items-center justify-center"
      style={{ padding: "clamp(72px, 10vw, 140px) 48px" }}
    >
      <div className="flex items-center gap-5 md:gap-9">
        <p
          className="text-black shrink-0"
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: "clamp(22px, 2.4vw, 32px)",
            fontWeight: 400,
          }}
        >
          We are
        </p>

        <div
          className="relative overflow-hidden"
          style={{
            height: "clamp(180px, 20vw, 300px)",
            width: "clamp(220px, 30vw, 460px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)",
          }}
        >
          <motion.div
            animate={{ y: ["0%", "-50%"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            {LOOP_WORDS.map((word, i) => (
              <p
                key={i}
                className={word === "Studio Mudiaga" ? "text-black" : "text-black/25"}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500,
                  fontSize: "clamp(24px, 3.4vw, 44px)",
                  lineHeight: 1.5,
                  whiteSpace: "nowrap",
                }}
              >
                {word}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
