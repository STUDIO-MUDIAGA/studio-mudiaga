import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

/** Let a customer cancel their own booking while it's still pending —
 *  once confirmed, cancelling is an admin action (admin/bookings/shortlets). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (body?.status !== "cancelled") {
    return NextResponse.json({ error: "Only cancelling is allowed here" }, { status: 400 });
  }

  const { data: booking, error: fetchErr } = await db
    .from("shortlet_bookings")
    .select("id, user_id, status")
    .eq("id", id)
    .single();
  if (fetchErr || !booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.user_id !== user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  if (booking.status !== "pending") {
    return NextResponse.json({ error: "Only pending bookings can be cancelled" }, { status: 409 });
  }

  const { error } = await db.from("shortlet_bookings").update({ status: "cancelled" }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
