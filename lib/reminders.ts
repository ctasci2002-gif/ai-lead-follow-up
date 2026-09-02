import { Resend } from "resend";
import { createAdminClient } from "./supabase/admin";

type DueLead = {
  id: string;
  user_id: string;
  name: string;
  company: string;
  score: number;
  temperature: string;
  next_follow_up_at: string;
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function buildDigestHtml(leads: DueLead[]) {
  const rows = leads
    .map(
      (lead) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${lead.name}</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${lead.company}</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${lead.temperature} (${lead.score}/100)</td>
          <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${lead.next_follow_up_at}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#0b1020;">
      <h2>Bugün takip etmen gereken ${leads.length} lead var</h2>
      <table style="border-collapse:collapse;width:100%;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #0b1020;">Lead</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #0b1020;">Şirket</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #0b1020;">Durum</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #0b1020;">Takip Tarihi</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

export async function sendDailyReminders() {
  const supabase = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const today = todayStr();

  const { data: dueLeads, error } = await supabase
    .from("leads")
    .select("id, user_id, name, company, score, temperature, next_follow_up_at")
    .not("next_follow_up_at", "is", null)
    .lte("next_follow_up_at", today);

  if (error) throw error;

  if (!dueLeads || dueLeads.length === 0) {
    return { usersWithDueLeads: 0, emailsSent: 0, failures: [] };
  }

  const leadsByUser = new Map<string, DueLead[]>();

  for (const lead of dueLeads as DueLead[]) {
    const list = leadsByUser.get(lead.user_id) ?? [];
    list.push(lead);
    leadsByUser.set(lead.user_id, list);
  }

  let emailsSent = 0;
  const failures: { userId: string; error: string }[] = [];

  for (const [userId, userLeads] of leadsByUser) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError || !userData?.user?.email) {
      failures.push({
        userId,
        error: userError?.message || "Kullanıcının e-posta adresi bulunamadı.",
      });
      continue;
    }

    const { error: sendError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "AI Lead Follow-Up <onboarding@resend.dev>",
      to: userData.user.email,
      subject: `Bugün takip etmen gereken ${userLeads.length} lead var`,
      html: buildDigestHtml(userLeads),
    });

    if (sendError) {
      failures.push({ userId, error: sendError.message });
      continue;
    }

    emailsSent += 1;
  }

  return { usersWithDueLeads: leadsByUser.size, emailsSent, failures };
}
