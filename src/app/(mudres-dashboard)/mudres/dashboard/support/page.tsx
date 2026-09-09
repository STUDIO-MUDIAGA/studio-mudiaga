"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import DashboardShell from "@/components/mudres/DashboardShell";
import { useAuth } from "@/context/AuthContext";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const MUTED = "#6F7A5E";
const LINE = "#E7E8E0";
const SURFACE = "#F5F5F1";

type Message = { id: string; sender: "customer" | "studio"; body: string; created_at: string };

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function MudresSupportPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = () =>
    fetch("/api/support/messages")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Message[]) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    const optimistic: Message = {
      id: `local-${Date.now()}`,
      sender: "customer",
      body: text,
      created_at: new Date().toISOString(),
    };
    setMessages((current) => [...(current ?? []), optimistic]);
    setDraft("");

    try {
      await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
    } finally {
      setSending(false);
      load();
    }
  };

  return (
    <DashboardShell>
      <h1 style={{ color: DARK, fontSize: "clamp(26px, 3.6vw, 34px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
        Chat with us
      </h1>
      <p style={{ color: MUTED, fontSize: 13.5, margin: "0 0 22px" }}>
        Message the studio about an order, a piece, or anything else. We reply here and by email.
      </p>

      <div style={{ border: `1px solid ${LINE}`, borderRadius: 18, display: "flex", flexDirection: "column", height: "min(560px, 62vh)" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          {messages === null && <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>}

          {messages?.length === 0 && (
            <div style={{ margin: "auto", textAlign: "center", maxWidth: 280 }}>
              <MessageCircle size={26} color="#A9B199" strokeWidth={1.5} />
              <p style={{ color: MUTED, fontSize: 13, margin: "14px 0 0" }}>
                Say hello — the studio usually replies within a day.
              </p>
            </div>
          )}

          {messages?.map((m) => (
            <Bubble key={m.id} message={m} name={profile?.full_name} />
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${LINE}` }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            style={{
              flex: 1, background: SURFACE, border: "none", borderRadius: 999,
              padding: "12px 16px", fontSize: 13.5, color: DARK, outline: "none", fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            aria-label="Send message"
            style={{
              width: 42, height: 42, borderRadius: "50%", border: "none", flex: "0 0 auto",
              background: draft.trim() ? DARK : "#D8DAD0", color: WHITE,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: draft.trim() ? "pointer" : "default",
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}

function Bubble({ message, name }: { message: Message; name: string | null | undefined }) {
  const mine = message.sender === "customer";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "78%", padding: "10px 14px", borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: mine ? DARK : SURFACE, color: mine ? WHITE : DARK,
          fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}
      >
        {message.body}
      </div>
      <span style={{ color: MUTED, fontSize: 10.5, margin: "4px 4px 0" }}>
        {mine ? name || "You" : "Studio Mudiaga"} · {timeLabel(message.created_at)}
      </span>
    </div>
  );
}
