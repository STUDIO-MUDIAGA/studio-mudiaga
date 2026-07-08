"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const EASE = [0.76, 0, 0.24, 1] as [number, number, number, number];

// Phase timings (ms)
const T = { typed: 1100, hold: 1900, split: 2900 };

function LogoLayer({ typed, offset }: { typed: boolean; offset: string }) {
  return (
    <div
      className="absolute top-0 h-full flex items-center justify-center"
      style={{ left: offset, width: "100vw" }}
    >
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: typed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: typed ? 0 : 1.0, ease: EASE }}
      >
        <Image src="/Group.svg" alt="Studio Mudiaga" width={460} height={73} priority unoptimized />
      </motion.div>
    </div>
  );
}

export default function HomeV2Intro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), T.typed),
      setTimeout(() => setPhase(2), T.hold),
      setTimeout(() => {
        setPhase(3);
        onComplete();
      }, T.split),
    ];
    return () => ts.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === 3) return null;

  const typed = phase >= 1;
  const splitting = phase >= 2;

  return (
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: "none" }}>
      {/* Left door */}
      <motion.div
        className="fixed top-0 left-0 h-full overflow-hidden"
        style={{ width: "50%", backgroundColor: "#0a0a0a" }}
        animate={{ x: splitting ? "-100%" : "0%" }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <LogoLayer typed={typed} offset="0" />
      </motion.div>

      {/* Right door */}
      <motion.div
        className="fixed top-0 right-0 h-full overflow-hidden"
        style={{ width: "50%", backgroundColor: "#0a0a0a" }}
        animate={{ x: splitting ? "100%" : "0%" }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <LogoLayer typed={typed} offset="-50vw" />
      </motion.div>
    </div>
  );
}
