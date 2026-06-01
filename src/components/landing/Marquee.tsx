const words = ["Lagos", "·", "Abuja", "·", "Luxury", "·", "Shortlets", "·", "Furniture", "·", "Design", "·", "Living", "·", "Curated", "·"];

const repeated = [...words, ...words, ...words];

export default function Marquee() {
  return (
    <div className="relative py-5 overflow-hidden border-y border-white/5">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: marquee 22s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="marquee-track flex gap-8 whitespace-nowrap w-max">
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
      </div>
    </div>
  );
}
