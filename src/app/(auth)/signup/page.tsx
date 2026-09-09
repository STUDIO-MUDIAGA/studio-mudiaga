"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { safeNext } from "@/lib/safe-next";

const ORANGE = "#c46442";
const HERO = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80";

const inputStyle = { width: "100%", background: "#fafaf9", border: "1px solid #e8e8e4", borderRadius: 12, padding: "13px 16px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box" as const };

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const next = safeNext(useSearchParams().get("next"));
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true); setLoading(false);
  };

  const topRight = (
    <p style={{ color: "#aaa", fontSize: 13 }}>
      Already have an account?{" "}
      <Link href="/login" style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
    </p>
  );

  if (success) {
    return (
      <AuthSplitLayout image={HERO} quote="Your next great space is waiting." tagline="Curated shortlets and handcrafted furniture across Nigeria." topRight={topRight}>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ width: 64, height: 64, background: "#fdf0eb", border: "1px solid #f5d4c8", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Mail size={24} color={ORANGE} />
          </div>
          <h2 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>Check your email</h2>
          <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, margin: "0 0 28px" }}>
            We sent a confirmation link to <span style={{ color: "#555" }}>{email}</span>.<br />
            Click it to activate your account.
          </p>
          <Link href="/login" style={{ color: ORANGE, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Back to sign in</Link>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout image={HERO} quote="Your next great space is waiting." tagline="Curated shortlets and handcrafted furniture across Nigeria." topRight={topRight}>
      <h1 style={{ color: "#0a0a0a", fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}>Create your account</h1>
      <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 28px" }}>Join Studio Mudiaga and unlock premium living.</p>

      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 7 }}>Full name</label>
          <input style={inputStyle} type="text" placeholder="e.g. Emeka Obi" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 7 }}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input style={{ ...inputStyle, paddingRight: 40 }} type={showPassword ? "text" : "password"} placeholder="Min 8 chars" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              <button type="button" onClick={() => setShowPassword((p) => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: 0 }}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 7 }}>Confirm</label>
            <div style={{ position: "relative" }}>
              <input style={{ ...inputStyle, paddingRight: 40 }} type={showConfirm ? "text" : "password"} placeholder="Repeat" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowConfirm((p) => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: 0 }}>
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
        {error && <p style={{ color: "#dc2626", fontSize: 12, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", background: ORANGE, color: "#fff", border: "none", borderRadius: 12, padding: "13px 16px", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: 4 }}>
          {loading ? "Creating account…" : "Create Account →"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", color: "#ccc", fontSize: 11, lineHeight: 1.6 }}>
        By creating an account you agree to our{" "}
        <Link href="/terms" style={{ color: "#aaa", textDecoration: "underline" }}>Terms</Link>
        {" "}and{" "}
        <Link href="/privacy-policy" style={{ color: "#aaa", textDecoration: "underline" }}>Privacy Policy</Link>.
      </p>
    </AuthSplitLayout>
  );
}
