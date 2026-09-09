import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** One row per customer thread: latest message + whether the customer is
 *  waiting on a reply (their message is the newest one in the thread). */
export async function GET() {
  const { data: messages, error } = await db
    .from("support_messages")
    .select("id, user_id, sender, body, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const byUser = new Map<string, { latest: typeof messages[number]; unread: boolean }>();
  for (const m of messages ?? []) {
    const existing = byUser.get(m.user_id);
    if (!existing) {
      byUser.set(m.user_id, { latest: m, unread: m.sender === "customer" });
    }
  }

  const userIds = [...byUser.keys()];
  if (userIds.length === 0) return NextResponse.json([]);

  const { data: profiles } = await db
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const threads = userIds.map((userId) => {
    const { latest, unread } = byUser.get(userId)!;
    const profile = profileMap.get(userId);
    return {
      user_id: userId,
      full_name: profile?.full_name ?? "Unknown customer",
      email: profile?.email ?? "",
      preview: latest.body,
      last_sender: latest.sender,
      last_at: latest.created_at,
      unread,
    };
  }).sort((a, b) => new Date(b.last_at).getTime() - new Date(a.last_at).getTime());

  return NextResponse.json(threads);
}
