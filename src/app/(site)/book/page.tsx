"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, Loader2, Upload, ArrowLeft, ArrowRight } from "lucide-react";

const AMBER = "#fbbf24";

const PROJECT_TYPES = [
  "New build / unfurnished space",
  "Renovation / remodel of existing space",
  "Partial redesign of specific rooms",
  "Hospitality / commercial space",
  "Other",
];

const AREAS = [
  "Living room", "Dining area", "Master bedroom", "Additional bedrooms",
  "Home office", "Kitchen", "Bathrooms", "Walkway / entrance",
  "Outdoor / terrace", "Full home", "Other",
];

const BUDGETS = [
  "Below ₦5,000,000",
  "₦5,000,000 — ₦15,000,000",
  "₦15,000,000 — ₦30,000,000",
  "₦30,000,000 — ₦60,000,000",
  "Above ₦60,000,000",
  "I prefer to discuss this directly",
];

const STEP_NAMES = ["About you", "Your project", "Your vision", "Your budget", "Your expectations"];
const TOTAL_STEPS = STEP_NAMES.length;

type UploadedImage = { url: string; uploading: boolean };

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500, marginBottom: hint ? 4 : 10, lineHeight: 1.5 }}>
        {label}
      </label>
      {hint && <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 12, margin: "0 0 10px" }}>{hint}</p>}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12, padding: "13px 16px", color: "#fff", fontSize: 14,
  outline: "none", boxSizing: "border-box", fontFamily: "var(--font-inter)",
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={inputStyle}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
    />
  );
}

function TextArea({ rows = 5, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={rows}
      style={{ ...inputStyle, resize: "none", lineHeight: 1.7, minHeight: rows * 24 }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
    />
  );
}

function RadioRow({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              background: active ? "rgba(251,191,36,0.08)" : "#111",
              border: `1px solid ${active ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 12, padding: "13px 16px", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <span style={{
              width: 17, height: 17, borderRadius: "50%", flexShrink: 0,
              border: `1.5px solid ${active ? AMBER : "rgba(255,255,255,0.25)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {active && <span style={{ width: 9, height: 9, borderRadius: "50%", background: AMBER }} />}
            </span>
            <span style={{ color: active ? "#fff" : "rgba(255,255,255,0.75)", fontSize: 14 }}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function CheckboxGrid({ options, values, onToggle }: { options: string[]; values: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
      {options.map((opt) => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            style={{
              display: "flex", alignItems: "center", gap: 9, textAlign: "left",
              background: active ? "rgba(251,191,36,0.08)" : "#111",
              border: `1px solid ${active ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 12, padding: "11px 13px", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <span style={{
              width: 16, height: 16, borderRadius: 5, flexShrink: 0,
              border: `1.5px solid ${active ? AMBER : "rgba(255,255,255,0.25)"}`,
              background: active ? AMBER : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {active && <Check size={11} color="#000" strokeWidth={3} />}
            </span>
            <span style={{ color: active ? "#fff" : "rgba(255,255,255,0.75)", fontSize: 13 }}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function StartProjectPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0); // 0 = cover, 1..TOTAL_STEPS = form
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");

  const [projectType, setProjectType] = useState("");
  const [projectTypeOther, setProjectTypeOther] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [spaceSize, setSpaceSize] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [areasOther, setAreasOther] = useState("");
  const [occupancy, setOccupancy] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const [feeling, setFeeling] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dislikes, setDislikes] = useState("");
  const [dailyLife, setDailyLife] = useState("");
  const [household, setHousehold] = useState("");

  const [budget, setBudget] = useState("");
  const [budgetScope, setBudgetScope] = useState("");
  const [priorExperience, setPriorExperience] = useState("");

  const [successVision, setSuccessVision] = useState("");
  const [involvement, setInvolvement] = useState("");
  const [importantContext, setImportantContext] = useState("");
  const [anythingElse, setAnythingElse] = useState("");

  function toggleArea(area: string) {
    setAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - images.length);
    e.target.value = "";
    for (const file of files) {
      const idx = images.length;
      setImages((prev) => [...prev, { url: "", uploading: true }]);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/enquiries/upload", { method: "POST", body: formData });
        const data = await res.json();
        setImages((prev) => prev.map((img, i) => (i === idx ? { url: data.url ?? "", uploading: false } : img)));
      } catch {
        setImages((prev) => prev.filter((_, i) => i !== idx));
      }
    }
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  const stillUploading = images.some((i) => i.uploading);
  const isCover = step === 0;
  const isLastStep = step === TOTAL_STEPS;
  const canContinue = step === 1 ? fullName.trim() !== "" && email.trim() !== "" : true;

  function goNext() {
    if (!canContinue) {
      setError("Please share your name and email so we can reach you.");
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLastStep) { goNext(); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName, email, phone, location, source,
          project_type: projectType, project_type_other: projectTypeOther,
          property_location: propertyLocation, space_size: spaceSize,
          areas, areas_other: areasOther, occupancy, target_date: targetDate,
          feeling, inspiration, inspiration_images: images.filter((i) => i.url).map((i) => i.url),
          dislikes, daily_life: dailyLife, household,
          budget, budget_scope: budgetScope, prior_experience: priorExperience,
          success_vision: successVision, involvement, important_context: importantContext, anything_else: anythingElse,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ background: "#0a0a0a", height: "100dvh", boxSizing: "border-box", paddingTop: 96, paddingLeft: 32, paddingRight: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: AMBER, marginBottom: 18 }}>
            Start a Project
          </p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, color: "#fff", lineHeight: 1.35 }}>
            Thank you. We read every enquiry personally. If your project is right for us you will hear from us within 48 hours.
          </h1>
        </div>
      </div>
    );
  }

  // ── Cover screen ──────────────────────────────────────────────
  if (isCover) {
    return (
      <div style={{ background: "#0a0a0a", height: "100dvh", boxSizing: "border-box", paddingTop: 96, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 560, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: AMBER, marginBottom: 18 }}>
            Start a Project
          </p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 400, color: "#fff", lineHeight: 1.2, marginBottom: 18 }}>
            Tell us about the space you&apos;re dreaming of.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            No forms that feel like paperwork — just a conversation. Take your time, share as much as feels useful, and we&apos;ll take it from there.
          </p>
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              background: AMBER, color: "#000", border: "none", borderRadius: 14,
              padding: "16px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            Let&apos;s begin <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", height: "100dvh", boxSizing: "border-box", paddingTop: 96, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ maxWidth: 780, width: "100%", margin: "0 auto", padding: "0 24px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

        {/* Progress */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: AMBER }}>
              {STEP_NAMES[step - 1]}
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
              {step} of {TOTAL_STEPS}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {STEP_NAMES.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? AMBER : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", minHeight: 0, overflowY: "auto", padding: "24px 0" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                {/* Step 1 — About you */}
                {step === 1 && (
                  <>
                    <Row>
                      <Field label="Full name">
                        <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" autoFocus />
                      </Field>
                      <Field label="Email address">
                        <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                      </Field>
                    </Row>
                    <Row>
                      <Field label="Phone number">
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
                      </Field>
                      <Field label="Location — city and state">
                        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lekki, Lagos" />
                      </Field>
                    </Row>
                    <Field label="How did you find STUDIOMUDIAGA?">
                      <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Instagram, referral, Google…" />
                    </Field>
                  </>
                )}

                {/* Step 2 — Your project (dense — scrolls) */}
                {step === 2 && (
                  <>
                    <Field label="What type of project is this?">
                      <RadioRow options={PROJECT_TYPES} value={projectType} onChange={setProjectType} />
                      {projectType === "Other" && (
                        <div style={{ marginTop: 10 }}>
                          <Input value={projectTypeOther} onChange={(e) => setProjectTypeOther(e.target.value)} placeholder="Tell us more" />
                        </div>
                      )}
                    </Field>
                    <Row>
                      <Field label="Where is the property located?">
                        <Input value={propertyLocation} onChange={(e) => setPropertyLocation(e.target.value)} placeholder="Address, estate, or area" />
                      </Field>
                      <Field label="What is the approximate size of the space in square metres or rooms?">
                        <Input value={spaceSize} onChange={(e) => setSpaceSize(e.target.value)} placeholder="e.g. 250 sqm, or 4 bedrooms" />
                      </Field>
                    </Row>
                    <Field label="Which specific areas are you looking to work on?">
                      <CheckboxGrid options={AREAS} values={areas} onToggle={toggleArea} />
                      {areas.includes("Other") && (
                        <div style={{ marginTop: 10 }}>
                          <Input value={areasOther} onChange={(e) => setAreasOther(e.target.value)} placeholder="Which other areas?" />
                        </div>
                      )}
                    </Field>
                    <Row>
                      <Field label="Is the property currently occupied or vacant?">
                        <Input value={occupancy} onChange={(e) => setOccupancy(e.target.value)} placeholder="Occupied or vacant" />
                      </Field>
                      <Field label="What is your target move-in or completion date?">
                        <Input value={targetDate} onChange={(e) => setTargetDate(e.target.value)} placeholder="e.g. Q3 2026, or a specific date" />
                      </Field>
                    </Row>
                  </>
                )}

                {/* Step 3 — Your vision (dense — scrolls) */}
                {step === 3 && (
                  <>
                    <Field label="How would you describe the feeling you want your space to have when it is complete?" hint="Do not think about style — think about feeling.">
                      <TextArea rows={5} value={feeling} onChange={(e) => setFeeling(e.target.value)} placeholder="Take your time here…" />
                    </Field>
                    <Field label="Are there any spaces — hotels, restaurants, homes, or images — that have made you feel the way you want your space to feel?" hint="Share links or images if you have them.">
                      <TextArea rows={3} value={inspiration} onChange={(e) => setInspiration(e.target.value)} placeholder="Links, names of places, or a short description…" />
                    </Field>

                    <div>
                      <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500, marginBottom: 10 }}>
                        Attach inspiration images <span style={{ color: "rgba(255,255,255,0.32)", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {images.map((img, i) => (
                          <div key={i} style={{ position: "relative", width: 64, height: 64, borderRadius: 10, overflow: "hidden", background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}>
                            {img.uploading ? (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Loader2 size={16} color={AMBER} style={{ animation: "spin 1s linear infinite" }} />
                              </div>
                            ) : (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <X size={10} color="#fff" />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                        {images.length < 8 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ width: 64, height: 64, borderRadius: 10, background: "#111", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}
                          >
                            <Upload size={13} color="rgba(255,255,255,0.4)" />
                            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Add</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <Field label="Are there any styles, colours, or design directions you strongly dislike or want to avoid?">
                      <TextArea rows={3} value={dislikes} onChange={(e) => setDislikes(e.target.value)} placeholder="Anything you'd rather we steer clear of…" />
                    </Field>
                    <Field label="How do you live in your space day to day?" hint="Describe a typical morning, evening, or weekend at home.">
                      <TextArea rows={5} value={dailyLife} onChange={(e) => setDailyLife(e.target.value)} placeholder="Walk us through a normal day…" />
                    </Field>
                    <Field label="Who else lives in or uses the space regularly?">
                      <TextArea rows={3} value={household} onChange={(e) => setHousehold(e.target.value)} placeholder="Family, partner, pets, staff, frequent guests…" />
                    </Field>
                  </>
                )}

                {/* Step 4 — Your budget */}
                {step === 4 && (
                  <>
                    <Field label="What is your investment budget for this project?">
                      <RadioRow options={BUDGETS} value={budget} onChange={setBudget} />
                    </Field>
                    <Field label="Does your budget include furniture, fixtures, and accessories or is it for construction and finishing only?">
                      <Input value={budgetScope} onChange={(e) => setBudgetScope(e.target.value)} placeholder="Tell us what's included" />
                    </Field>
                    <Field label="Have you worked with an interior designer before? If yes what was the experience like?">
                      <TextArea rows={3} value={priorExperience} onChange={(e) => setPriorExperience(e.target.value)} placeholder="Optional, but helpful context…" />
                    </Field>
                  </>
                )}

                {/* Step 5 — Your expectations */}
                {step === 5 && (
                  <>
                    <Field label="What does a successful project look like to you?" hint="What would make you look at the finished space and feel that the investment was completely worth it?">
                      <TextArea rows={4} value={successVision} onChange={(e) => setSuccessVision(e.target.value)} placeholder="Paint us the picture…" />
                    </Field>
                    <Field label="How involved do you want to be in the process — hands on at every decision or trusting the studio to lead and presenting you with the outcome?">
                      <Input value={involvement} onChange={(e) => setInvolvement(e.target.value)} placeholder="Hands on, mostly hands off, or somewhere in between" />
                    </Field>
                    <Field label="Is there anything specific about your lifestyle, work, or personality that you think is important for us to understand before we begin?">
                      <TextArea rows={4} value={importantContext} onChange={(e) => setImportantContext(e.target.value)} placeholder="Whatever feels relevant…" />
                    </Field>
                    <Field label="Is there anything else you would like us to know?">
                      <TextArea rows={4} value={anythingElse} onChange={(e) => setAnythingElse(e.target.value)} placeholder="The floor is yours…" />
                    </Field>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {error && (
            <div style={{ color: "#f87171", fontSize: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "10px 14px", margin: "10px 0 0", flexShrink: 0 }}>
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, padding: "16px 0", flexShrink: 0 }}>
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                <ArrowLeft size={15} /> Back
              </button>
            )}
            <button
              type="submit"
              disabled={submitting || (isLastStep && stillUploading)}
              style={{
                flex: 1, background: AMBER, color: "#000", border: "none", borderRadius: 14,
                padding: "15px 0", fontSize: 15, fontWeight: 700,
                cursor: submitting || (isLastStep && stillUploading) ? "not-allowed" : "pointer",
                opacity: submitting || (isLastStep && stillUploading) ? 0.6 : 1, transition: "opacity 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {isLastStep
                ? (submitting ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : "Begin")
                : <>Continue <ArrowRight size={15} /></>}
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
