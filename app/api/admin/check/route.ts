import { createRouteClient } from "../../../../lib/supabase/server";

function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;

  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.toLowerCase());
}

export async function GET() {
  const supabase = await createRouteClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return Response.json({ isAdmin: false }, { status: 403 });
  }

  return Response.json({ isAdmin: true });
}
