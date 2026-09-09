"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Thread = {
  user_id: string;
  full_name: string;
  email: string;
  preview: string;
  last_sender: "customer" | "studio";
  last_at: string;
  unread: boolean;
};

type Message = { id: string; sender: "customer" | "studio"; body: string; created_at: string };

const fmtTime = (s: string) => new Date(s).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function SupportInboxPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [customer, setCustomer] = useState<{ full_name: string | null; email: string | null } | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThreads = () => {
    setLoadingThreads(true);
    fetch("/api/admin/support")
      .then((r) => r.json())
      .then((data: Thread[]) => {
        setThreads(Array.isArray(data) ? data : []);
        setLoadingThreads(false);
      });
  };

  useEffect(loadThreads, []);

  // Live updates across every thread — a new customer message bumps the
  // thread list (and appends to the open conversation) without a refresh.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-support-inbox")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages" },
        (payload) => {
          const row = payload.new as Message & { user_id: string };
          loadThreads();
          if (row.user_id !== activeId) return;
          setMessages((cur) => {
            const optimisticIdx = cur.findIndex((m) => m.id.startsWith("local-") && m.sender === row.sender && m.body === row.body);
            if (optimisticIdx !== -1) {
              const next = [...cur];
              next[optimisticIdx] = row;
              return next;
            }
            if (cur.some((m) => m.id === row.id)) return cur;
            return [...cur, row];
          });
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const openThread = (userId: string) => {
    setActiveId(userId);
    fetch(`/api/admin/support/${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages ?? []);
        setCustomer(d.customer ?? null);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      });
  };

  const sendReply = async () => {
    if (!activeId || !reply.trim()) return;
    const text = reply.trim();
    setSending(true);
    setReply("");
    setMessages((cur) => [...cur, { id: `local-${Date.now()}`, sender: "studio", body: text, created_at: new Date().toISOString() }]);
    await fetch(`/api/admin/support/${activeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    setSending(false);
  };

  return (
    <div style={{ height: "100%", display: "flex", background: "#fafafa" }}>
      {/* Thread list */}
      <div style={{ width: 320, flexShrink: 0, background: "#fff", borderRight: "1px solid #eee", overflowY: "auto" }}>
        <div style={{ padding: "20px 20px 14px" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1e156d", margin: 0 }}>Support Inbox</p>
          <p style={{ fontSize: 12, color: "#888", margin: "3px 0 0" }}>{threads.filter((t) => t.unread).length} awaiting reply</p>
        </div>

        {loadingThreads ? (
          <p style={{ padding: 20, color: "#aaa", fontSize: 13 }}>Loading…</p>
        ) : threads.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#bbb" }}>
            <MessageCircle size={26} style={{ opacity: 0.4, marginBottom: 8 }} />
            <p style={{ fontSize: 13, margin: 0 }}>No conversations yet</p>
          </div>
        ) : (
          threads.map((t) => (
            <button
              key={t.user_id}
              onClick={() => openThread(t.user_id)}
              style={{
                width: "100%", textAlign: "left", display: "block", padding: "14px 20px", border: "none",
                borderBottom: "1px solid #f5f5f5", cursor: "pointer", fontFamily: "inherit",
                background: activeId === t.user_id ? "#f7f7fb" : "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{t.full_name}</span>
                {t.unread && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c46442", flexShrink: 0 }} />}
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.last_sender === "studio" ? "You: " : ""}{t.preview}
              </p>
              <p style={{ margin: 0, fontSize: 10.5, color: "#bbb" }}>{fmtTime(t.last_at)}</p>
            </button>
          ))
        )}
      </div>

      {/* Thread view */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {!activeId ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
            <p style={{ fontSize: 13 }}>Select a conversation</p>
          </div>
        ) : (
          <>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #eee", background: "#fff" }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>{customer?.full_name ?? "Customer"}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888" }}>{customer?.email}</p>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: m.sender === "studio" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "70%" }}>
                    <div
                      style={{
                        padding: "10px 14px", borderRadius: 14, fontSize: 13, lineHeight: 1.5,
                        background: m.sender === "studio" ? "#1e156d" : "#fff",
                        color: m.sender === "studio" ? "#fff" : "#222",
                        border: m.sender === "studio" ? "none" : "1px solid #eee",
                      }}
                    >
                      {m.body}
                    </div>
                    <p style={{ margin: "4px 4px 0", fontSize: 10.5, color: "#bbb", textAlign: m.sender === "studio" ? "right" : "left" }}>{fmtTime(m.created_at)}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: "14px 24px", borderTop: "1px solid #eee", background: "#fff", display: "flex", gap: 10 }}>
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !sending) sendReply(); }}
                placeholder="Type a reply…"
                style={{ flex: 1, padding: "11px 14px", border: "1px solid #ddd", borderRadius: 10, fontSize: 13, outline: "none" }}
              />
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e156d", color: "#fff", border: "none", borderRadius: 10, padding: "0 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: sending || !reply.trim() ? 0.6 : 1 }}
              >
                <Send size={13} /> Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
