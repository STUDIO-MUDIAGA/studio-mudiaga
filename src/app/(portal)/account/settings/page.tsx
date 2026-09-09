"use client";

import { useState } from "react";
import { User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import AbodeDashboardShell from "@/components/abode/AbodeDashboardShell";

const WHITE = "#FFFFFF";
const DARK = "#0a0a0a";
const ORANGE = "#c46442";
const MUTED = "#888888";
const FAINT = "#aaaaaa";
const LINE = "#ebebeb";
const SURFACE = "#f7f7f5";

type Tab = "account" | "security";

const TABS: { id: Tab; label: string; icon: typeof UserIcon }[] = [
  { id: "account", label: "Account Settings", icon: UserIcon },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const inputStyle: React.CSSProperties = {
  width: "100%", background: WHITE, border: `1px solid ${LINE}`, borderRadius: 11,
  padding: "11px 13px", color: DARK, fontSize: 13.5, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
};

export default function AccountSettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("account");

  const [name, setName] = useState(profile?.full_name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [nameStatus, setNameStatus] = useState<"idle" | "saved" | "error">("idle");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saved" | "error">("idle");
  const [passwordError, setPasswordError] = useState("");

  const initial = (profile?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();

  const saveName = async () => {
    if (!user || !name.trim()) return;
    setSavingName(true);
    setNameStatus("idle");
    const { error } = await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", user.id);
    setSavingName(false);
    if (error) {
      setNameStatus("error");
      return;
    }
    await refreshProfile();
    setNameStatus("saved");
    setTimeout(() => setNameStatus("idle"), 2500);
  };

  const savePassword = async () => {
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    setPasswordStatus("idle");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPasswordError(error.message);
      setPasswordStatus("error");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus("saved");
    setTimeout(() => setPasswordStatus("idle"), 2500);
  };

  return (
    <AbodeDashboardShell>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
        <h1 style={{ color: DARK, fontSize: "clamp(24px, 3.2vw, 30px)", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
          Settings
        </h1>

        {tab === "account" ? (
          <button
            onClick={saveName}
            disabled={savingName || !name.trim()}
            style={{
              background: ORANGE, color: WHITE, border: "none", borderRadius: 999, padding: "10px 20px",
              fontSize: 12.5, fontWeight: 600, cursor: savingName ? "default" : "pointer", fontFamily: "inherit",
              opacity: savingName || !name.trim() ? 0.6 : 1,
            }}
          >
            {savingName ? "Saving…" : nameStatus === "saved" ? "Saved" : "Save Changes"}
          </button>
        ) : (
          <button
            onClick={savePassword}
            disabled={savingPassword || !newPassword || !confirmPassword}
            style={{
              background: ORANGE, color: WHITE, border: "none", borderRadius: 999, padding: "10px 20px",
              fontSize: 12.5, fontWeight: 600, cursor: savingPassword ? "default" : "pointer", fontFamily: "inherit",
              opacity: savingPassword || !newPassword || !confirmPassword ? 0.6 : 1,
            }}
          >
            {savingPassword ? "Updating…" : passwordStatus === "saved" ? "Updated" : "Update Password"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${LINE}`, marginBottom: 28 }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "0 4px 12px", marginRight: 20,
                border: "none", borderBottom: active ? `2px solid ${ORANGE}` : "2px solid transparent",
                background: "transparent", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13.5, fontWeight: 600, color: active ? DARK : MUTED,
              }}
            >
              <Icon size={15} strokeWidth={1.8} /> {label}
            </button>
          );
        })}
      </div>

      {tab === "account" && (
        <div>
          <h2 style={{ color: DARK, fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>Profile Information</h2>
          <p style={{ color: MUTED, fontSize: 12.5, margin: "0 0 22px" }}>
            Manage your personal details and keep your contact info up to date.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <span style={{ width: 52, height: 52, borderRadius: "50%", background: ORANGE, color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700, flex: "0 0 auto" }}>
              {initial}
            </span>
            <div>
              <p style={{ color: DARK, fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>Profile picture</p>
              <p style={{ color: FAINT, fontSize: 12, margin: 0 }}>Generated from your name — photo uploads aren&apos;t available yet.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: 640 }}>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", color: MUTED, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 }}>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", color: MUTED, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 }}>Email</span>
              <input value={user?.email ?? ""} disabled style={{ ...inputStyle, background: SURFACE, color: FAINT, cursor: "not-allowed" }} />
            </label>
          </div>

          {nameStatus === "error" && (
            <p style={{ color: "#A33", fontSize: 12.5, margin: "14px 0 0" }}>Could not save your name. Try again.</p>
          )}
        </div>
      )}

      {tab === "security" && (
        <div>
          <h2 style={{ color: DARK, fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>Password Management</h2>
          <p style={{ color: MUTED, fontSize: 12.5, margin: "0 0 22px" }}>
            Choose a new password for signing in to your account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: 640 }}>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", color: MUTED, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 }}>New password</span>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} style={inputStyle} />
            </label>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", color: MUTED, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 }}>Confirm new password</span>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} style={inputStyle} />
            </label>
          </div>

          {passwordError && <p style={{ color: "#A33", fontSize: 12.5, margin: "14px 0 0" }}>{passwordError}</p>}
        </div>
      )}
    </AbodeDashboardShell>
  );
}
