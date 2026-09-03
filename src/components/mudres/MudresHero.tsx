"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { HEADER_SPACE } from "./MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";

export type FurnitureItem = {
  id: string;
  name: string;
  category: string | null;
  price: number | null;
  original_price: number | null;
  images: string[] | null;
  description: string | null;
};

const CARD_W = 430;
const CARD_H = 580;
const GAP = 20;
const BAND_BASIS = 660;
const STEP_VH = 45;

/** The hero splits down the middle: copy left, rig right. The rig starts
 *  exactly where the copy column ends, so pieces that step past the focus are
 *  clipped rather than sliding under the headline. */
const COPY_COL = "50%";
const COPY_PAD = "clamp(36px, 6vw, 120px)";
/** Gutter holding the headline off the focused card. */
const COPY_GUTTER = "clamp(40px, 5vw, 88px)";

/** Falloff either side of the focused card, by places away from focus. */
const D_RANGE = [-3, -2, -1, 0, 1, 2, 3];
const SCALE_AT = [0.5, 0.58, 0.72, 1, 0.86, 0.78, 0.72];
const LIFT_AT = [70, 50, 28, 0, 18, 34, 48];
const FADE_AT = [0, 0.15, 0.4, 1, 0.8, 0.62, 0.5];

/** The catalogue is repeated so there is always a run of pieces trailing off
 *  to the right, including on the last step. Without this the rig empties out
 *  as it reaches the end. */
const REPEATS = 3;

/** Splits a product name into two balanced lines, so the headline occupies the
 *  same two lines whichever piece is in focus and the copy below never jumps. */
function twoLines(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return [name, ""];

  let bestAt = 1;
  let bestGap = Infinity;
  for (let at = 1; at < words.length; at++) {
    const head = words.slice(0, at).join(" ").length;
    const tail = words.slice(at).join(" ").length;
    const gap = Math.abs(head - tail);
    if (gap < bestGap) {
      bestGap = gap;
      bestAt = at;
    }
  }
  return [words.slice(0, bestAt).join(" "), words.slice(bestAt).join(" ")];
}

export default function MudresHero({ products }: { products: FurnitureItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const [compact, setCompact] = useState(false);
  const [fit, setFit] = useState(1);
  const [active, setActive] = useState(0);

  const count = products.length;
  const last = Math.max(0, count - 1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1000px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const pinned = !compact && !reduceMotion;

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig || compact) return;
    const measure = () =>
      setFit(Math.min(1, Math.max(0.55, rig.clientHeight / BAND_BASIS)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(rig);
    return () => ro.disconnect();
  }, [compact]);

  // Flattened, repeated catalogue. Focus indices stay within the first pass,
  // so the extra passes only ever fill the trailing space.
  const rig = useMemo(
    () =>
      Array.from({ length: REPEATS }, (_, pass) =>
        products.map((item) => ({ item, pass }))
      ).flat(),
    [products]
  );

  const cardW = Math.round(CARD_W * fit);
  const cardH = Math.round(CARD_H * fit);
  const stride = cardW + GAP;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Scroll picks a whole product, the spring carries the rig there. That
  // quantising is what makes the movement step rather than slide.
  const step = useSpring(0, { stiffness: 110, damping: 20, mass: 0.7 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const index = Math.min(last, Math.max(0, Math.round(p * last)));
    step.set(index);
    setActive(index);
  });

  const x = useTransform(step, (v) => -v * stride);

  const goToStep = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section || last === 0) return;
      const clamped = Math.min(last, Math.max(0, index));
      const travel = section.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: section.offsetTop + (travel * clamped) / last,
        behavior: "smooth",
      });
    },
    [last]
  );

  const current = products[active];
  const [line1, line2] = twoLines(current?.name ?? "Shop the Collection");

  // ── Compact: copy, then a plain swipeable row ──────────────────────
  if (compact) {
    return (
      <section ref={sectionRef} style={{ background: WHITE, paddingTop: HEADER_SPACE + 34 }}>
        <div style={{ padding: "0 20px 28px" }}>
          <h1
            style={{
              color: DARK, fontSize: "clamp(32px, 9vw, 46px)", fontWeight: 700,
              lineHeight: 1.02, letterSpacing: "-0.035em", margin: "0 0 14px",
            }}
          >
            Shop the Collection
          </h1>
          <p style={{ color: "rgba(42,56,18,0.6)", fontSize: 14.5, lineHeight: 1.65, margin: "0 0 22px" }}>
            Handcrafted pieces built to bring warmth, character and longevity to
            your space.
          </p>
          <Link href="/mudres/collection" style={ctaStyle}>
            Shop now <ArrowUpRight size={15} />
          </Link>
        </div>
        <div
          style={{
            overflowX: "auto", overflowY: "hidden",
            scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none", paddingBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 20px", width: "max-content" }}>
            {products.map((item) => (
              <div key={item.id} style={{ flex: "0 0 auto" }}>
                <HeroCard item={item} compact />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Wide: copy on the left, stepping rig on the right ──────────────
  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: WHITE,
        height: pinned ? `${last * STEP_VH + 100}vh` : "auto",
      }}
    >
      <div
        style={{
          position: pinned ? "sticky" : "relative",
          top: 0, height: "100vh", overflow: "hidden",
          paddingTop: HEADER_SPACE,
        }}
      >
        {/* Card rig, clipped to its own column */}
        <div
          ref={rigRef}
          style={{
            position: "absolute", left: COPY_COL, right: 0, top: HEADER_SPACE, bottom: 0,
            overflow: "hidden", display: "flex", alignItems: "center",
          }}
        >
          <motion.div
            style={{
              x: pinned ? x : 0,
              display: "flex", alignItems: "center", gap: GAP,
              width: "max-content", willChange: "transform",
            }}
          >
            {rig.map(({ item, pass }, i) => (
              <FocusCard
                key={`${item.id}-${pass}`}
                item={item}
                index={i}
                step={step}
                width={cardW}
                height={cardH}
                reduceMotion={!!reduceMotion}
              />
            ))}
          </motion.div>
        </div>

        {/* Copy column */}
        <div
          style={{
            position: "relative", zIndex: 2, height: "100%",
            width: COPY_COL, paddingLeft: COPY_PAD, paddingRight: COPY_GUTTER,
            display: "flex", alignItems: "center",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>

            <AnimatePresence mode="wait">
              <motion.div
                key={current?.id ?? active}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  style={{
                    color: SAGE, fontSize: 10.5, fontWeight: 700,
                    letterSpacing: "0.22em", textTransform: "uppercase",
                    margin: "0 0 10px",
                  }}
                >
                  {current?.category ?? "Collection"}
                </p>
                <h1
                  style={{
                    color: DARK, fontSize: "clamp(38px, 4vw, 62px)", fontWeight: 700,
                    lineHeight: 1.02, letterSpacing: "-0.035em", margin: "0 0 16px",
                    maxWidth: "100%", overflowWrap: "break-word",
                  }}
                >
                  <span style={{ display: "block" }}>{line1}</span>
                  <span style={{ display: "block", minHeight: "1em" }}>{line2}</span>
                </h1>
                <p
                  style={{
                    color: "rgba(42,56,18,0.6)", fontSize: 15, lineHeight: 1.7,
                    margin: "0 0 26px", maxWidth: 420,
                  }}
                >
                  {current?.description ??
                    "Handcrafted pieces built to bring warmth, character and longevity to your space."}
                </p>
                <Link
                  href={current ? `/mudres/collection/${current.id}` : "/mudres/collection"}
                  style={ctaStyle}
                >
                  Shop now <ArrowUpRight size={15} />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Arrows and counter */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <ArrowButton label="Previous" disabled={active === 0} onClick={() => goToStep(active - 1)}>
                  <ArrowLeft size={16} />
                </ArrowButton>
                <ArrowButton label="Next" disabled={active === last} onClick={() => goToStep(active + 1)}>
                  <ArrowRight size={16} />
                </ArrowButton>
              </div>
              <p style={{ color: "rgba(42,56,18,0.45)", fontSize: 13, fontWeight: 500, margin: 0, letterSpacing: "0.04em" }}>
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ctaStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  background: DARK, color: WHITE, fontWeight: 600, fontSize: 13,
  padding: "13px 24px", borderRadius: 999, textDecoration: "none",
};

/** One card in the rig. Scale, lift and fade all key off how many places it
 *  sits from the focused card, so the centre reads as the subject. */
function FocusCard({
  item, index, step, width, height, reduceMotion,
}: {
  item: FurnitureItem;
  index: number;
  step: MotionValue<number>;
  width: number;
  height: number;
  reduceMotion: boolean;
}) {
  const distance = useTransform(step, (v) => index - v);
  const scale = useTransform(distance, D_RANGE, SCALE_AT);
  const y = useTransform(distance, D_RANGE, LIFT_AT);
  const opacity = useTransform(distance, D_RANGE, FADE_AT);

  return (
    <motion.div style={{ scale, y, opacity, flex: "0 0 auto", willChange: "transform" }}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 70 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: reduceMotion ? 0 : 0.15 + Math.min(index, 6) * 0.08,
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <HeroCard item={item} width={width} height={height} />
      </motion.div>
    </motion.div>
  );
}

function ArrowButton({
  children, onClick, disabled, label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 44, height: 44, borderRadius: "50%",
        border: `1px solid rgba(42,56,18,${disabled ? 0.14 : 0.32})`,
        background: "transparent",
        color: disabled ? "rgba(42,56,18,0.25)" : DARK,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        transition: "background 0.2s ease, color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = DARK;
        e.currentTarget.style.color = WHITE;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = disabled ? "rgba(42,56,18,0.25)" : DARK;
      }}
    >
      {children}
    </button>
  );
}

function HeroCard({
  item, width, height, compact,
}: {
  item: FurnitureItem;
  width?: number;
  height?: number;
  compact?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [cartHover, setCartHover] = useState(false);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      id: item.id,
      name: item.name,
      price: item.price ?? 0,
      image: item.images?.[0] ?? null,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: compact ? "72vw" : width,
        maxWidth: compact ? 330 : undefined,
        height: compact ? undefined : height,
        aspectRatio: compact ? "3 / 4" : undefined,
        borderRadius: 20,
        overflow: "hidden",
        background: "rgba(42,56,18,0.05)",
        scrollSnapAlign: "center",
      }}
    >
      {/* The card body links through; the cart control sits beside it rather
          than inside it, so we never nest a button in an anchor. */}
      <Link
        href={`/mudres/collection/${item.id}`}
        style={{ position: "absolute", inset: 0, textDecoration: "none", display: "block" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images?.[0]}
          alt={item.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hover ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: 20,
            background: "linear-gradient(to top, rgba(28,38,12,0.88) 0%, rgba(28,38,12,0.12) 46%, rgba(28,38,12,0) 68%)",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>
            {item.category}
          </p>
          <h3 style={{ color: WHITE, fontSize: 18, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
            {item.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ color: WHITE, fontSize: 15, fontWeight: 700 }}>
              ₦{item.price?.toLocaleString()}
            </span>
            {item.original_price && (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "line-through" }}>
                ₦{item.original_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={addToCart}
        onMouseEnter={() => setCartHover(true)}
        onMouseLeave={() => setCartHover(false)}
        aria-label={`Add ${item.name} to cart`}
        title={added ? "Added to cart" : `Add ${item.name} to cart`}
        style={{
          position: "absolute", top: 14, right: 14, zIndex: 2,
          width: 42, height: 42, borderRadius: "50%", cursor: "pointer",
          border: "none",
          // Solid fills, and the button inverts on its own hover rather than
          // only reacting to the card's.
          background: added ? SAGE : cartHover ? DARK : WHITE,
          color: added ? DARK : cartHover ? WHITE : DARK,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: cartHover
            ? "0 10px 24px -6px rgba(28,38,12,0.55)"
            : "0 6px 18px -6px rgba(28,38,12,0.45)",
          transition: "background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
          transform: `scale(${added ? 1.08 : cartHover ? 1.14 : hover ? 1.04 : 1})`,
        }}
      >
        {added ? <Check size={17} strokeWidth={2.4} /> : <ShoppingBag size={17} strokeWidth={1.9} />}
      </button>
    </div>
  );
}
