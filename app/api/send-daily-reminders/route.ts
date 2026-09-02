import { sendDailyReminders } from "../../../lib/reminders";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
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
