import { sendDailyReminders } from "../../../lib/reminders";

function isAuthorized(req: Request) {
  if (!process.env.CRON_SECRET) return false;

  const customSecret = req.headers.get("x-cron-secret");
  if (customSecret === process.env.CRON_SECRET) return true;

  // Vercel Cron automatically sends this header when CRON_SECRET is set
  // as a project env var: https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

async function handle(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendDailyReminders();
    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Hatırlatma e-postaları gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
