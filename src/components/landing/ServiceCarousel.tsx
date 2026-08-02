"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ITEMS = [
  { image: "/IMG_1611.JPG", label: "Interior design", tag: "Form · Balance · Light" },
  { image: "/IMG_1620.JPG", label: "Lighting design", tag: "Atmosphere · Focus · Harmony" },
  { image: "/IMG_1627.JPG", label: "Bespoke furnishings", tag: "Craft · Detail · Texture" },
  { image: "/IMG_1654.JPG", label: "Space Styling & Décor", tag: "Curation · Layering · Warmth" },
  { image: "/IMG_1613.JPG", label: "Furniture design", tag: "Form · Function · Comfort" },
  { image: "/IMG_1617.JPG", label: "Custom joinery", tag: "Precision · Grain · Detail" },
  { image: "/IMG_1624.JPG", label: "Art curation", tag: "Story · Texture · Soul" },
  { image: "/IMG_1629.JPG", label: "Project management", tag: "Timeline · Budget · Delivery" },
];

type Item = (typeof ITEMS)[number];

// Card + gap width in vw — drives both the track width and the scroll distance
const CARD_VW = 30;
const GAP_VW = 3;
const TRACK_VW = ITEMS.length * CARD_VW + (ITEMS.length - 1) * GAP_VW;
const SHIFT_VW = TRACK_VW - 94; // 94vw ≈ viewport minus side gutters

// Wrapper height — more scroll distance for a longer card row
const WRAPPER_VH = 260;

function Card({ item, style, className, sizes }: { item: Item; style?: React.CSSProperties; className?: string; sizes: string }) {
  return (
    <div
      className={`group relative overflow-hidden shrink-0 ${className ?? ""}`}
      style={style}
    >
      <Image
        src={item.image}
        alt={item.label}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        sizes={sizes}
      />

      {/* Dark gradient — always visible on touch/mobile, hover-only from md up */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

      {/* Tag — top-left. Visible by default on mobile (no hover), hover-gated on md+ */}
      <span
        className="absolute top-4 left-4 text-white text-xs tracking-wide opacity-100 translate-y-0 md:opacity-0 md:-translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-400 ease-out"
        style={{
          fontFamily: "var(--font-inter)",
          background: "#3c150a",
          padding: "6px 12px",
        }}
      >
        {item.tag}
      </span>

      {/* Label — bottom-left. Visible by default on mobile (no hover), hover-gated on md+ */}
      <p
        className="absolute bottom-5 left-5 text-white opacity-100 translate-y-0 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-400 ease-out"
        style={{ fontFamily: "var(--font-inter)", fontSize: 17 }}
      >
        {item.label}
      </p>
    </div>
  );
}

export default function ServiceCarousel() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });

  const x = useTransform(smoothProgress, [0, 1], ["0vw", `-${SHIFT_VW}vw`]);

  return (
    <>
      {/* Mobile — plain horizontally-swipeable row, no scroll-jacking (avoids a huge pinned
          viewport dwarfing a short card row, and lets touch scrolling behave natively) */}
      <div
        className="md:hidden flex overflow-x-auto gap-4 px-4 pb-2"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {ITEMS.map((item) => (
          <Card
            key={item.label}
            item={item}
            sizes="70vw"
            className=""
            style={{ width: "70vw", aspectRatio: "3 / 4", scrollSnapAlign: "start" }}
          />
        ))}
      </div>

      {/* Desktop — pinned scroll-jacked horizontal pan */}
      <div className="hidden md:block" ref={wrapperRef} style={{ height: `${WRAPPER_VH}dvh` }}>
        <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center">
          <motion.div
            className="flex"
            style={{ x, gap: `${GAP_VW}vw`, paddingLeft: "3vw" }}
          >
            {ITEMS.map((item) => (
              <Card
                key={item.label}
                item={item}
                sizes="30vw"
                style={{ width: `clamp(190px, ${CARD_VW}vw, 100vw)`, aspectRatio: "3 / 4" }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
