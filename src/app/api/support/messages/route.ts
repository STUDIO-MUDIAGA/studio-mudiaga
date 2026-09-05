import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY!);
const NOTIFY_EMAIL = "studiomudiaga@gmail.com";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await db
    .from("support_messages")
    .select("id, sender, body, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const text = String(body?.body ?? "").trim().slice(0, 4000);
  if (!text) return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });

  const message = {
    id: "sm-" + Math.random().toString(36).slice(2, 9),
    user_id: user.id,
    sender: "customer" as const,
    body: text,
  };

  const { error } = await db.from("support_messages").insert(message);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // No admin inbox UI exists yet, so the studio is notified by email and
  // can reply for now by inserting a `sender: "studio"` row directly.
  if (process.env.RESEND_API_KEY) {
    const { data: profile } = await db
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "MUDRES <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `New MUDRES message from ${profile?.full_name || profile?.email || "a customer"}`,
      text: `${text}\n\n— ${profile?.full_name ?? ""} (${profile?.email ?? user.email ?? "unknown"})\nUser ID: ${user.id}`,
    }).catch(() => {
      // Best-effort notification; the message is already saved.
    });
  }

  return NextResponse.json({ id: message.id }, { status: 201 });
}
