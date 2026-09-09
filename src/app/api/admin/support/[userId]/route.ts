import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const [{ data: messages, error }, { data: profile }] = await Promise.all([
    db.from("support_messages").select("id, sender, body, created_at").eq("user_id", userId).order("created_at", { ascending: true }),
    db.from("profiles").select("id, full_name, email").eq("id", userId).single(),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ messages: messages ?? [], customer: profile ?? null });
}

export async function POST(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const body = await req.json().catch(() => null);
  const text = String(body?.body ?? "").trim().slice(0, 4000);
  if (!text) return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });

  const message = {
    id: "sm-" + Math.random().toString(36).slice(2, 9),
    user_id: userId,
    sender: "studio" as const,
    body: text,
  };

  const { error } = await db.from("support_messages").insert(message);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (process.env.RESEND_API_KEY) {
    const { data: profile } = await db.from("profiles").select("email, full_name").eq("id", userId).single();
    if (profile?.email) {
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "MUDRES <onboarding@resend.dev>",
        to: profile.email,
        subject: "New reply from MUDRES",
        text: `${text}\n\nView it in your account: https://studiomudiaga.com/mudres/dashboard/support`,
      }).catch(() => {
        // Best-effort notification; the message is already saved.
      });
    }
  }

  return NextResponse.json({ id: message.id }, { status: 201 });
}
