"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function HeroV2({ revealed }: { revealed: boolean }) {
  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Wordmark */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={revealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        className="text-white text-[12vw] leading-none tracking-tight font-light select-none"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Studio Mudiaga
      </motion.h1>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1, y: [0, 8, 0] } : {}}
        transition={{ opacity: { duration: 0.6, delay: 0.4 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 } }}
      >
        <ArrowDown size={22} />
      </motion.div>
    </section>
  );
}
