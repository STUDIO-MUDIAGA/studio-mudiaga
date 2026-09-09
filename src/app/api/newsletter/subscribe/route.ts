import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY!);
const AUDIENCE_ID = process.env.RESEND_MUDRES_AUDIENCE_ID!;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!AUDIENCE_ID) return NextResponse.json({ error: "Newsletter isn't configured yet" }, { status: 500 });

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const { error } = await resend.contacts.create({ email, audienceId: AUDIENCE_ID, unsubscribed: false });
  // Resend errors on a duplicate contact — that's still a success from the
  // subscriber's point of view, so don't surface it as a failure.
  if (error && !error.message?.toLowerCase().includes("already exists")) {
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
