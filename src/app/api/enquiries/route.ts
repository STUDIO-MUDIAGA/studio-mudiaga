import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const resend = new Resend(process.env.RESEND_API_KEY!);
const NOTIFY_EMAIL = "hello@studiomudiaga.com";

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;width:200px">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;line-height:1.6;white-space:pre-wrap">${value}</td>
    </tr>`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    full_name, email, phone, location, source,
    project_type, project_type_other, property_location, space_size,
    areas, areas_other, occupancy, target_date,
    feeling, inspiration, inspiration_images, dislikes, daily_life, household,
    budget, budget_scope, prior_experience,
    success_vision, involvement, important_context, anything_else,
  } = body;

  if (!full_name || !email) {
    return NextResponse.json({ error: "Full name and email are required" }, { status: 400 });
  }

  const { data, error } = await db.from("project_enquiries").insert({
    full_name, email, phone, location, source,
    project_type, project_type_other, property_location, space_size,
    areas: areas ?? [], areas_other, occupancy, target_date,
    feeling, inspiration, inspiration_images: inspiration_images ?? [], dislikes, daily_life, household,
    budget, budget_scope, prior_experience,
    success_vision, involvement, important_context, anything_else,
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const projectTypeDisplay = project_type === "Other" && project_type_other ? `Other — ${project_type_other}` : project_type;
  const areasDisplay = [...(areas ?? []), areas_other].filter(Boolean).join(", ");

  const imagesHtml = (inspiration_images ?? []).length > 0
    ? `<div style="margin-top:20px;display:flex;gap:8px;flex-wrap:wrap">${(inspiration_images as string[]).map((url) => `<img src="${url}" width="90" height="90" style="object-fit:cover;border-radius:8px" />`).join("")}</div>`
    : "";

  await resend.emails.send({
    from: `Studio Mudiaga <${process.env.RESEND_FROM_EMAIL ?? "hello@studiomudiaga.com"}>`,
    to: NOTIFY_EMAIL,
    subject: `New project enquiry — ${full_name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:40px 24px;background:#0a0a0a;color:#fff">
        <p style="color:#fbbf24;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px">
          Start a Project
        </p>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 24px">${full_name} wants to work with the studio</h1>
        <table style="width:100%;border-collapse:collapse">
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Location", location)}
          ${row("Found us via", source)}
          ${row("Project type", projectTypeDisplay)}
          ${row("Property location", property_location)}
          ${row("Space size", space_size)}
          ${row("Areas", areasDisplay)}
          ${row("Occupancy", occupancy)}
          ${row("Target date", target_date)}
          ${row("Desired feeling", feeling)}
          ${row("Inspiration", inspiration)}
          ${row("Dislikes", dislikes)}
          ${row("Daily life", daily_life)}
          ${row("Household", household)}
          ${row("Budget", budget)}
          ${row("Budget scope", budget_scope)}
          ${row("Prior experience", prior_experience)}
          ${row("Success vision", success_vision)}
          ${row("Involvement", involvement)}
          ${row("Important context", important_context)}
          ${row("Anything else", anything_else)}
        </table>
        ${imagesHtml}
      </div>
    `,
  });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
