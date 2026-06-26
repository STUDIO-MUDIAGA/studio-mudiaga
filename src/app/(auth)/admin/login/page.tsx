"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const steps = [
  { n: "1", label: "Enter your\nemail" },
  { n: "2", label: "Verify\nOTP code" },
  { n: "3", label: "Access\ngranted" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to send code. Try again.");
      setLoading(false);
      return;
    }

    setStep("otp");
    setResendCountdown(60);
    setLoading(false);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleVerifyOtp = async (code: string) => {
    setError("");
    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (verifyError) {
      setError("Invalid or expired code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      setLoading(false);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
      return;
    }

    // Check admin role
    const { data: role } = await supabase.rpc("get_my_role");
    if (role !== "admin") {
      await supabase.auth.signOut();
      setError("Access denied. This email is not authorised as admin.");
      setStep("email");
      setOtp(["", "", "", "", "", ""]);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const handleOtpChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = char;
    setOtp(next);

    if (char && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "")) {
      handleVerifyOtp(next.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split("");
      setOtp(next);
      otpRefs.current[5]?.focus();
      handleVerifyOtp(pasted);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setError("");
    setResendCountdown(60);
    await fetch("/api/admin/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  const activeStep = step === "email" ? 0 : 1;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* ── Left panel — image ── */}
      <div
        style={{ width: "45%", flexShrink: 0, position: "relative", overflow: "hidden" }}
        className="hidden lg:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)" }} />

        <div style={{ position: "absolute", bottom: "40px", left: "40px", right: "40px" }}>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, lineHeight: 1.3, marginBottom: "8px" }}>
            Manage your Studio.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", maxWidth: "260px", lineHeight: 1.6, marginBottom: "24px" }}>
            Your command centre for shortlets, furniture, and guests.
          </p>

          {/* Step cards */}
          <div style={{ display: "flex", gap: "10px" }}>
            {steps.map(({ n, label }, i) => (
              <div
                key={n}
                style={{
                  flex: 1,
                  borderRadius: "14px",
                  padding: "14px",
                  background: i === activeStep ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)",
                  border: i === activeStep ? "1px solid rgba(251,191,36,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 700, marginBottom: "10px",
                  background: i === activeStep ? "#fbbf24" : "rgba(255,255,255,0.12)",
                  color: i === activeStep ? "#000" : "rgba(255,255,255,0.4)",
                  transition: "all 0.3s ease",
                }}>
                  {n}
                </div>
                <p style={{
                  fontSize: "11px", fontWeight: 500, lineHeight: 1.4, whiteSpace: "pre-line",
                  color: i === activeStep ? "#fbbf24" : "rgba(255,255,255,0.35)",
                  transition: "color 0.3s ease",
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{ flex: 1, background: "#0c0c0c", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
          <div style={{ width: "100%", maxWidth: "380px" }}>

            {step === "email" ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Admin Sign In</h2>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
                    Enter your email and we'll send you a sign-in code.
                  </p>
                </div>

                <form onSubmit={handleSendOtp}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: "12px", marginBottom: "6px" }}>
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="eg. admin@studiomudiaga.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                      style={{
                        width: "100%", background: "#111",
                        border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px",
                        padding: "12px 16px", color: "#fff", fontSize: "14px",
                        outline: "none", boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                  </div>

                  {error && (
                    <div style={{ color: "#f87171", fontSize: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%", background: "#fbbf24", color: "#000", border: "none",
                      borderRadius: "12px", padding: "13px 20px", fontSize: "14px",
                      fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.6 : 1, transition: "opacity 0.15s",
                    }}
                  >
                    {loading ? "Sending code…" : "Send sign-in code"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Check your email</h2>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: 1.6 }}>
                    We sent a 6-digit code to<br />
                    <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{email}</span>
                  </p>
                </div>

                {/* OTP boxes */}
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }} onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      disabled={loading}
                      style={{
                        width: "48px", height: "56px", textAlign: "center",
                        background: "#111", border: digit ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px", color: "#fff", fontSize: "20px", fontWeight: 600,
                        outline: "none", caretColor: "#fbbf24", boxSizing: "border-box",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = digit ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.08)")}
                    />
                  ))}
                </div>

                {loading && (
                  <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "16px" }}>
                    Verifying…
                  </p>
                )}

                {error && (
                  <div style={{ color: "#f87171", fontSize: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
                    {error}
                  </div>
                )}

                <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
                  Didn't receive it?{" "}
                  <button
                    onClick={handleResend}
                    disabled={resendCountdown > 0}
                    style={{
                      background: "none", border: "none", cursor: resendCountdown > 0 ? "not-allowed" : "pointer",
                      color: resendCountdown > 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                      fontSize: "13px", fontWeight: 500, padding: 0,
                    }}
                  >
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend code"}
                  </button>
                </p>

                <button
                  onClick={() => { setStep("email"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                  style={{
                    display: "block", margin: "16px auto 0", background: "none", border: "none",
                    color: "rgba(255,255,255,0.2)", fontSize: "12px", cursor: "pointer",
                  }}
                >
                  ← Use a different email
                </button>
              </>
            )}

            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "13px", marginTop: "28px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500, textDecoration: "none" }}>
                ← Back to website
              </Link>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px" }}>
          <p style={{ color: "rgba(255,255,255,0.1)", fontSize: "11px" }}>© 2025 Studio Mudiaga</p>
          <Link href="/privacy-policy" style={{ color: "rgba(255,255,255,0.1)", fontSize: "11px", textDecoration: "none" }}>Privacy</Link>
        </div>
      </div>
    </div>
  );
}
