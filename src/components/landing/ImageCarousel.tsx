"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const IMAGES = [
  { src: "/IMG_1611.JPG", w: 360, h: 420 },
  { src: "/IMG_1613.JPG", w: 520, h: 300 },
  { src: "/IMG_1615.JPG", w: 340, h: 460 },
  { src: "/IMG_1617.JPG", w: 560, h: 340 },
  { src: "/IMG_1620.JPG", w: 360, h: 420 },
  { src: "/IMG_1623.JPG", w: 500, h: 300 },
  { src: "/IMG_1624.JPG", w: 340, h: 440 },
  { src: "/IMG_1627.JPG", w: 520, h: 320 },
  { src: "/IMG_1628.JPG", w: 360, h: 400 },
  { src: "/IMG_1629.JPG", w: 560, h: 340 },
];

// total track width: sum of widths + 9 gaps × 8px ≈ 4492px
// scrollable distance ≈ 4492 - ~1440 (viewport) = ~3052px
const SCROLL_DISTANCE = 3100;

export default function ImageCarousel() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${SCROLL_DISTANCE}px`]);

  return (
    // wrapper gives the section enough vertical scroll space
    <div ref={wrapperRef} style={{ height: `calc(${SCROLL_DISTANCE}px + 100vh)` }}>
      {/* sticky viewport — images translate inside here */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <motion.div
          style={{
            x,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            paddingLeft: 28,
          }}
        >
          {IMAGES.map((img, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                position: "relative",
                width: img.w,
                height: img.h,
                overflow: "hidden",
              }}
            >
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover"
                sizes="40vw"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
