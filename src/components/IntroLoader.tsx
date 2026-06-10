"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const EASE = [0.76, 0, 0.24, 1] as [number, number, number, number];

const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const BOX  = "polygon(42% 36%, 58% 36%, 58% 64%, 42% 64%)";

// Diagonal expand: top-left → top edge → bottom-left → full
const EXPAND_KF = [
  BOX,
  "polygon(0% 0%, 58% 36%, 58% 64%, 42% 64%)",
  "polygon(0% 0%, 100% 0%, 58% 64%, 42% 64%)",
  "polygon(0% 0%, 100% 0%, 58% 64%, 0% 100%)",
  FULL,
];

// Phase timings (ms)
const T = { p1: 1200, p2: 1900, p3: 2500, p4: 3350, p5: 5200 };

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), T.p1),
      setTimeout(() => setPhase(2), T.p2),
      setTimeout(() => setPhase(3), T.p3),
      setTimeout(() => { setPhase(4); onComplete(); }, T.p4),
      setTimeout(() => setPhase(5), T.p5),
    ];
    return () => ts.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === 5) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">

      {/* Main overlay — full black → contracts to box → burnt orange → expands → slides up */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "#0a0a0a", clipPath: FULL }}
        animate={
          phase >= 4
            ? { y: "-100%", clipPath: FULL, backgroundColor: "#c85442" }
            : phase >= 3
            ? { clipPath: EXPAND_KF, backgroundColor: "#c85442" }
            : phase >= 2
            ? { clipPath: BOX, backgroundColor: "#0a0a0a" }
            : { clipPath: FULL, backgroundColor: "#0a0a0a" }
        }
        transition={
          phase >= 4
            ? { y: { duration: 1.7, ease: EASE }, clipPath: { duration: 0 }, backgroundColor: { duration: 0 } }
            : phase >= 3
            ? { clipPath: { duration: 0.75, ease: "easeInOut" }, backgroundColor: { duration: 0.05 } }
            : { clipPath: { duration: 0.55, ease: EASE }, backgroundColor: { duration: 0 } }
        }
      />

      {/* Full logo — types in left→right, fades at phase 1 */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)", opacity: 1 }}
          animate={
            phase >= 1
              ? { clipPath: "inset(0 0% 0 0)", opacity: 0 }
              : { clipPath: "inset(0 0% 0 0)", opacity: 1 }
          }
          transition={
            phase >= 1
              ? { opacity: { duration: 0.3, ease: "easeOut" }, clipPath: { duration: 0 } }
              : { clipPath: { duration: 1.0, ease: EASE }, opacity: { duration: 0 } }
          }
        >
          <Image
            src="/Group.svg"
            alt="Studio Mudiaga"
            width={460}
            height={73}
            priority
            unoptimized
          />
        </motion.div>
      </div>

      {/* M mark — fades in at phase 1, fades out at phase 2 */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: phase >= 2 ? 0 : phase >= 1 ? 1 : 0,
            scale:   phase >= 2 ? 0.9 : phase >= 1 ? 1 : 0.85,
          }}
          transition={{
            opacity: { duration: 0.35, ease: "easeOut" },
            scale:   { duration: 0.45, ease: EASE },
          }}
        >
          <Image
            src="/Vector.svg"
            alt="M"
            width={72}
            height={62}
            priority
            unoptimized
          />
        </motion.div>
      </div>

    </div>
  );
}
