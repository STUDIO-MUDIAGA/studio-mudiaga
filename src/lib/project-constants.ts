// Slugs already used by hand-built pages under src/app/(site)/projects/<slug> —
// blocked so a client-created project can never shadow or collide with them.
// Kept in its own client-safe file (no Supabase/service-role import) since
// ProjectForm.tsx needs it in the browser.
export const RESERVED_PROJECT_SLUGS = ["abode", "ub"];
