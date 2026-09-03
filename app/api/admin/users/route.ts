import { createRouteClient } from "../../../../lib/supabase/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;

  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.toLowerCase());
}

export async function GET() {
  try {
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdminEmail(user.email)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const admin = createAdminClient();
    const users: {
      id: string;
      email: string | undefined;
      created_at: string;
      last_sign_in_at: string | null | undefined;
      email_confirmed_at: string | null | undefined;
    }[] = [];

    let page = 1;
    const perPage = 200;

    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) throw error;

      for (const u of data.users) {
        users.push({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
        });
      }

      if (data.users.length < perPage) break;
      page += 1;
    }

    users.sort((a, b) => b.created_at.localeCompare(a.created_at));

    return Response.json({ users });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Kullanıcılar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
