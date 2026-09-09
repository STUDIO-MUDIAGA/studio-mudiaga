import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const MUTED = "#6F7A5E";
const LINE = "#E7E8E0";

const SECTIONS = [
  "How to measure your space",
  "Standard seating dimensions",
  "Standard table dimensions",
  "Material and care by type",
  "Cleaning and maintenance tips",
];

export default function SizeGuidePage() {
  return (
    <div style={{ background: WHITE, minHeight: "100vh", color: DARK, paddingTop: HEADER_SPACE + 16 }}>
      <div className="px-5 md:px-10 pt-8 pb-20" style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
          Size &amp; Care Guide
        </h1>
        <p style={{ color: MUTED, fontSize: 14, margin: "0 0 40px" }}>
          Placeholder page — fill in real measurements and care instructions below.
        </p>

        {SECTIONS.map((title) => (
          <div key={title} style={{ borderTop: `1px solid ${LINE}`, padding: "24px 0" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{title}</h2>
            <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
              Add details here.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
