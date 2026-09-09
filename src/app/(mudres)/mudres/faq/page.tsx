import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const MUTED = "#6F7A5E";
const LINE = "#E7E8E0";

const QUESTIONS = [
  "How long does an order take to arrive?",
  "Do you deliver outside Lagos?",
  "Can I customize a piece (fabric, wood finish, size)?",
  "What payment methods do you accept?",
  "How do I track my order?",
  "What is your return policy?",
];

export default function FaqPage() {
  return (
    <div style={{ background: WHITE, minHeight: "100vh", color: DARK, paddingTop: HEADER_SPACE + 16 }}>
      <div className="px-5 md:px-10 pt-8 pb-20" style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: MUTED, fontSize: 14, margin: "0 0 40px" }}>
          Placeholder page — fill in real answers below, add/remove questions as needed.
        </p>

        {QUESTIONS.map((q) => (
          <div key={q} style={{ borderTop: `1px solid ${LINE}`, padding: "20px 0" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 8px" }}>{q}</h2>
            <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
              Add answer here.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
