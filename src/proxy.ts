import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// Service role client — bypasses RLS, safe in server-only proxy context
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const AUTH_RELEVANT_PREFIXES = [
  "/account", "/admin", "/api/admin", "/login", "/signup",
  // MUDRES runs its own sign-in, so its authed routes need the session too.
  // The public MUDRES pages stay on the fast path.
  "/mudres/orders", "/mudres/login", "/mudres/signup",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip the Supabase round-trip entirely on public marketing/content pages —
  // getUser() is a network call and was adding it to every single page load.
  if (!AUTH_RELEVANT_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — must not call getSession() here, use getUser()
  const { data: { user } } = await supabase.auth.getUser();

  // ── Protect /account ──────────────────────────────────────────────
  if (pathname.startsWith("/account")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ── Protect MUDRES order history ──────────────────────────────────
  // MUDRES has its own sign-in, separate from ABODE's at /login.
  if (pathname.startsWith("/mudres/orders") && !user) {
    const to = new URL("/mudres/login", request.url);
    to.searchParams.set("next", pathname);
    return NextResponse.redirect(to);
  }

  // ── Protect /admin pages and /api/admin/* endpoints ────────────────
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (isAdminApi || isAdminPage) {
    if (!user) {
      return isAdminApi
        ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Use service role to check role — bypasses RLS, always reliable
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return isAdminApi
        ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
        : NextResponse.redirect(new URL("/admin/login?error=access_denied", request.url));
    }
  }

  // ── Redirect already-logged-in admin away from login page ─────────
  if (user && pathname === "/admin/login") {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // ── Redirect already-logged-in users away from auth pages ─────────
  if (user) {
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    // MUDRES keeps its own pair, and its own landing page.
    if (pathname === "/mudres/login" || pathname === "/mudres/signup") {
      return NextResponse.redirect(new URL("/mudres/orders", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
