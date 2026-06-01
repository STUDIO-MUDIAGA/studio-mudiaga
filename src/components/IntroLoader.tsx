"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as [number, number, number, number];

interface Props {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: Props) {
  const [phase, setPhase] = useState(0);
  // 0 → revealing text right-to-left
  // 1 → zooming in
  // 2 → splitting apart
  // 3 → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setPhase(2), 2100);
    const t3 = setTimeout(() => {
      setPhase(3);
      onComplete();
    }, 2900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onComplete]);

  if (phase === 3) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Top panel */}
      <motion.div
        className="absolute inset-x-0 top-0 bg-[#0a0a0a]"
        style={{ height: "50%" }}
        animate={phase >= 2 ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
      />

      {/* Bottom panel */}
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-[#0a0a0a]"
        style={{ height: "50%" }}
        animate={phase >= 2 ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
      />

      {/* Logo centred over the panels */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={
            phase >= 2
              ? { scale: 1.6, opacity: 0 }
              : phase >= 1
              ? { scale: 1.25 }
              : { scale: 1 }
          }
          transition={{ duration: 0.65, ease: EASE }}
          style={{
            clipPath:
              phase === 0
                ? "inset(0 0 0 100%)"
                : "inset(0 0 0 0%)",
          }}
        >
          {/* clip-path driven reveal right → left on mount */}
          <motion.div
            initial={{ clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white whitespace-nowrap select-none">
              studio
              <span className="text-amber-400">mudiaga</span>
            </h1>
          </motion.div>
        </motion.div>
      </div>

      {/* Thin amber line that sweeps right → left under the logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative overflow-hidden h-px w-[520px] md:w-[760px]">
          <motion.div
            className="absolute inset-y-0 left-0 bg-amber-400/60"
            initial={{ scaleX: 0, transformOrigin: "right" }}
            animate={{ scaleX: [0, 1, 1, 0] }}
            transition={{
              duration: 1.2,
              ease: EASE,
              delay: 0.1,
              times: [0, 0.45, 0.55, 1],
            }}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
