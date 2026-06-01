"use client";

import { motion } from "framer-motion";

const words = [
  "Lagos",
  "·",
  "Abuja",
  "·",
  "Luxury",
  "·",
  "Shortlets",
  "·",
  "Furniture",
  "·",
  "Design",
  "·",
  "Living",
  "·",
  "Curated",
  "·",
];

export default function Marquee() {
  const repeated = [...words, ...words, ...words];

  return (
    <div className="relative py-6 overflow-hidden border-y border-white/5 bg-white/2">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((word, i) => (
          <span
            key={i}
            className={
              word === "·"
                ? "text-amber-400 text-sm font-bold"
                : "text-white/20 text-sm font-semibold uppercase tracking-widest"
            }
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
