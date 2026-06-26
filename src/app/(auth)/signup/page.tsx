"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

const HERO = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80";

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12, padding: "13px 16px", color: "#fff", fontSize: 13,
  outline: "none", boxSizing: "border-box" as const,
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignupPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
  };

  const topRight = (
    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
      Already have an account?{" "}
      <Link href="/login" style={{ color: "#fbbf24", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
    </p>
  );

  if (success) {
    return (
      <AuthSplitLayout image={HERO} quote="Your next great space is waiting." tagline="Curated shortlets and handcrafted furniture across Nigeria." topRight={topRight}>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ width: 64, height: 64, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Mail size={24} color="#fbbf24" />
          </div>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>Check your email</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7, margin: "0 0 28px" }}>
            We sent a confirmation link to <span style={{ color: "rgba(255,255,255,0.7)" }}>{email}</span>.<br />
            Click it to activate your account.
          </p>
          <Link href="/login" style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Back to sign in</Link>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout image={HERO} quote="Your next great space is waiting." tagline="Curated shortlets and handcrafted furniture across Nigeria." topRight={topRight}>
      <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}>Create your account</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 28px" }}>Join Studio Mudiaga and unlock premium living.</p>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "13px 16px",
          background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 13, fontWeight: 500,
          cursor: "pointer", marginBottom: 20, opacity: googleLoading ? 0.5 : 1,
        }}
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting…" : "Sign up with Google"}
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>or sign up with email</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 7 }}>Full name</label>
          <input style={inputStyle} type="text" placeholder="e.g. Emeka Obi" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>

        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 7 }}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input style={{ ...inputStyle, paddingRight: 40 }} type={showPassword ? "text" : "password"} placeholder="Min 8 chars" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              <button type="button" onClick={() => setShowPassword((p) => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 0 }}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 7 }}>Confirm</label>
            <div style={{ position: "relative" }}>
              <input style={{ ...inputStyle, paddingRight: 40 }} type={showConfirm ? "text" : "password"} placeholder="Repeat" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowConfirm((p) => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 0 }}>
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "10px 14px", margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", background: "#fbbf24", color: "#000", border: "none", borderRadius: 12,
            padding: "13px 16px", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1, marginTop: 4,
          }}
        >
          {loading ? "Creating account…" : "Create Account →"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11, lineHeight: 1.6 }}>
        By creating an account you agree to our{" "}
        <Link href="/terms" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "underline" }}>Terms</Link>
        {" "}and{" "}
        <Link href="/privacy-policy" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "underline" }}>Privacy Policy</Link>.
      </p>
    </AuthSplitLayout>
  );
}
