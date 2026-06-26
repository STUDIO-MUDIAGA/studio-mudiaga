"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

const steps = [
  { n: "1", label: "Sign in to\nyour account" },
  { n: "2", label: "Manage\nproperties" },
  { n: "3", label: "Track &\nanalyse" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("Access denied. Admin accounts only.");
        setLoading(false);
        return;
      }
    }

    router.push("/admin");
    router.refresh();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?type=admin` },
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* ── Left panel ── */}
      <div
        style={{
          width: "45%",
          flexShrink: 0,
          background: "linear-gradient(135deg, #1a5c42 0%, #0f3d2e 50%, #081f18 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px",
        }}
        className="hidden lg:flex"
      >
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Studio Mudiaga
        </p>

        <div>
          <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: 700, lineHeight: 1.2, marginBottom: "10px" }}>
            Manage your<br />Studio.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: 1.6, maxWidth: "240px" }}>
            Complete these steps to access your command centre.
          </p>
        </div>

        {/* Step cards */}
        <div style={{ display: "flex", gap: "12px" }}>
          {steps.map(({ n, label }, i) => (
            <div
              key={n}
              style={{
                flex: 1,
                borderRadius: "16px",
                padding: "16px",
                background: i === 0 ? "#fff" : "rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  marginBottom: "12px",
                  background: i === 0 ? "#000" : "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                {n}
              </div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  color: i === 0 ? "#000" : "rgba(255,255,255,0.5)",
                  whiteSpace: "pre-line",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div
        style={{
          flex: 1,
          background: "#0c0c0c",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
          <div style={{ width: "100%", maxWidth: "380px" }}>

            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>
                Admin Sign In
              </h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
                Enter your credentials to access the portal.
              </p>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "12px 20px",
                color: "rgba(255,255,255,0.75)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                marginBottom: "20px",
                opacity: googleLoading ? 0.5 : 1,
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#222")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#1a1a1a")}
            >
              <GoogleIcon />
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Or</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: "12px", marginBottom: "6px" }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="eg. admin@studiomudiaga.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  style={{
                    width: "100%",
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: "6px" }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: "12px", marginBottom: "6px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={{
                      width: "100%",
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "12px 44px 12px 16px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginBottom: "20px" }}>
                Must be at least 8 characters.
              </p>

              {/* Error */}
              {error && (
                <div
                  style={{
                    color: "#f87171",
                    fontSize: "12px",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.15)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: "12px",
                  padding: "13px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {loading ? "Verifying…" : "Sign In"}
              </button>
            </form>

            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "13px", marginTop: "24px" }}>
              Back to{" "}
              <Link href="/" style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500, textDecoration: "none" }}>
                Website
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px" }}>
          <p style={{ color: "rgba(255,255,255,0.12)", fontSize: "11px" }}>© 2025 Studio Mudiaga</p>
          <Link href="/privacy-policy" style={{ color: "rgba(255,255,255,0.12)", fontSize: "11px", textDecoration: "none" }}>
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
