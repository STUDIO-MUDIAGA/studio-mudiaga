"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const pathname = usePathname();
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  const x = useSpring(rawX, { stiffness: 350, damping: 30, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 350, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest("[data-cursor]");
      setLabel(el ? el.getAttribute("data-cursor") : null);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY]);

  const expanded = !!label;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9997] pointer-events-none"
      style={{ x, y, willChange: "transform" }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.2 } }}
    >
      {/* centering wrapper */}
      <div style={{ transform: "translate(-50%, -50%)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* outer ring */}
        <motion.div
          className="absolute rounded-full"
          animate={{
            width: expanded ? 148 : 36,
            height: expanded ? 148 : 36,
            borderColor: "rgba(255,255,255,0.5)",
            borderWidth: 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.6 }}
        />
        {/* inner filled circle */}
        <motion.div
          className="rounded-full flex items-center justify-center overflow-hidden"
          animate={{
            width: expanded ? 120 : 12,
            height: expanded ? 120 : 12,
            backgroundColor: "rgba(0,0,0,1)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.5 }}
        >
          <motion.p
            animate={{ opacity: expanded ? 1 : 0, scale: expanded ? 1 : 0.7 }}
            transition={{ duration: 0.2, delay: expanded ? 0.08 : 0 }}
            className="text-white text-[10px] font-medium tracking-[0.18em] uppercase text-center leading-snug select-none px-3"
          >
            {label}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
