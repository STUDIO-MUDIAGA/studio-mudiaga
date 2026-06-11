"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const panels = [
  {
    image: "/IMG_1666.JPG",
    tag: "Shortlets · Lagos",
    heading: "We have never\ncompromised\non comfort.",
    body: "Every space in our collection is curated with intention — from the texture of the sheets to the grain of the timber.",
    cta: "Explore Stays",
    href: "/shortlets",
    imageRight: false,
  },
  {
    image: "/IMG_1654.JPG",
    tag: "Furniture · Handcrafted",
    heading: "Crafted once.\nBuilt to last\na lifetime.",
    body: "Our artisans work with locally sourced solid wood, shaping each piece by hand. No two are exactly alike.",
    cta: "View Collection",
    href: "/furniture",
    imageRight: true,
  },
  {
    image: "/IMG_1675.JPG",
    tag: "Shortlets · Abuja",
    heading: "Space designed\nto be lived\nin fully.",
    body: "We don't just furnish rooms. We build environments where life unfolds naturally and beautifully.",
    cta: "Book a Stay",
    href: "/shortlets",
    imageRight: false,
  },
];

export default function HorizontalPanels() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Translate panels container: 0 → -(N-1)*100vw
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(panels.length - 1) * 100}vw`]
  );

  return (
    // Outer wrapper defines total scroll distance — 100vh per panel
    <div ref={wrapperRef} style={{ height: `${panels.length * 100}vh` }}>
      {/* Sticky viewport — stays fixed while wrapper scrolls */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x, width: `${panels.length * 100}vw` }}
          transition={{ type: "tween" }}
        >
          {panels.map((panel, i) => (
            <div
              key={i}
              className="w-screen h-full flex-shrink-0 flex"
            >
              {panel.imageRight ? (
                <>
                  <TextPane panel={panel} index={i} />
                  <ImagePane image={panel.image} />
                </>
              ) : (
                <>
                  <ImagePane image={panel.image} />
                  <TextPane panel={panel} index={i} />
                </>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ImagePane({ image }: { image: string }) {
  return (
    <div className="w-1/2 h-full relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

function TextPane({
  panel,
  index,
}: {
  panel: (typeof panels)[number];
  index: number;
}) {
  return (
    <div className="w-1/2 h-full bg-[#f5f0eb] flex items-center px-16 xl:px-24">
      <div className="max-w-md">
        <p className="text-[#0a0a0a]/40 text-xs tracking-[0.25em] uppercase mb-6">
          {panel.tag}
        </p>
        <h2
          className="text-[#0a0a0a] text-4xl xl:text-5xl font-bold leading-[1.08] mb-6 whitespace-pre-line"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {panel.heading}
        </h2>
        <p className="text-[#0a0a0a]/55 text-sm leading-relaxed mb-10 max-w-xs">
          {panel.body}
        </p>
        <Link
          href={panel.href}
          className="group inline-flex items-center gap-3 text-[#0a0a0a] text-sm font-medium"
        >
          <span className="w-10 h-10 rounded-full border border-[#0a0a0a]/30 flex items-center justify-center group-hover:bg-[#0a0a0a]/10 transition-colors duration-200">
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
          {panel.cta}
        </Link>
        <div className="mt-16 text-[#0a0a0a]/20 text-xs tracking-widest">
          0{index + 1} / 0{panels.length}
        </div>
      </div>
    </div>
  );
}
