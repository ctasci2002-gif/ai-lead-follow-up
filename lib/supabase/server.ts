import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createRouteClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Route handlers in this app don't need to refresh the session;
          // middleware already handles cookie refresh on every request.
        },
      },
    }
  );
}
