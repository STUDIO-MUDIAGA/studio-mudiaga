import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Verify this email is an admin before doing anything
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("email", email)
    .single();

  // Always return success to avoid leaking which emails exist
  if (profile?.role !== "admin") {
    return NextResponse.json({ success: true });
  }

  // Generate OTP via admin API — bypasses all rate limits
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (error || !data?.properties?.email_otp) {
    console.error("generateLink error:", error);
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }

  const otp = data.properties.email_otp;

  // Send via Resend directly
  const { error: sendError } = await resend.emails.send({
    from: "Studio Mudiaga <hello@studiomudiaga.com>",
    to: email,
    subject: "Your Studio Mudiaga admin code",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0c0c0c;color:#fff">
        <p style="color:#fbbf24;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 24px">
          Studio Mudiaga Admin
        </p>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Your sign-in code</h1>
        <p style="color:rgba(255,255,255,0.45);font-size:14px;margin:0 0 32px">
          Enter this code on the admin login page. It expires in 15 minutes.
        </p>
        <div style="background:#1a1a1a;border:1px solid rgba(251,191,36,0.25);border-radius:16px;padding:32px;text-align:center;margin:0 0 32px">
          <p style="font-size:48px;font-weight:700;letter-spacing:0.3em;color:#fbbf24;margin:0">${otp}</p>
        </div>
        <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (sendError) {
    console.error("Resend error:", sendError);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
