"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* ── Left panel — image ── */}
      <div
        style={{
          width: "45%",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
        className="hidden lg:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, padding: "40px" }}>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, lineHeight: 1.3, marginBottom: "8px" }}>
            Manage your Studio.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", maxWidth: "260px", lineHeight: 1.6 }}>
            Your command centre for shortlets, furniture, and guests.
          </p>
        </div>
        {/* Step cards */}
        <div style={{ position: "absolute", bottom: "140px", left: "40px", right: "40px", display: "flex", gap: "10px" }}>
          {steps.map(({ n, label }, i) => (
            <div
              key={n}
              style={{
                flex: 1,
                borderRadius: "14px",
                padding: "14px",
                background: i === 0 ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.07)",
                border: i === 0 ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 700,
                  marginBottom: "10px",
                  background: i === 0 ? "#fbbf24" : "rgba(255,255,255,0.15)",
                  color: i === 0 ? "#000" : "rgba(255,255,255,0.5)",
                }}
              >
                {n}
              </div>
              <p style={{ fontSize: "11px", fontWeight: 500, lineHeight: 1.4, color: i === 0 ? "#fbbf24" : "rgba(255,255,255,0.4)", whiteSpace: "pre-line" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
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
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")}
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
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")}
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
                  background: "#fbbf24",
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
