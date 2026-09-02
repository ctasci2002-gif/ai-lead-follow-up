import { createRouteClient } from "../../../../lib/supabase/server";
import { sendOutreachEmail } from "../../../../lib/marketing";

const DAILY_SEND_LIMIT = 20;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function temperatureFor(score: number) {
  if (score >= 75) return "Sıcak";
  if (score >= 45) return "Ilık";
  return "Soğuk";
}

function todayStartIso() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function POST(req: Request) {
  try {
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const outreachMessageId =
      typeof body.outreachMessageId === "string" ? body.outreachMessageId : "";
    const recipientEmail =
      typeof body.recipientEmail === "string" ? body.recipientEmail.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const emailBody = typeof body.body === "string" ? body.body.trim() : "";
    const followUpInDays =
      typeof body.followUpInDays === "number" ? body.followUpInDays : null;

    if (!outreachMessageId || !subject || !emailBody) {
      return Response.json({ error: "Eksik bilgi." }, { status: 400 });
    }

    if (!EMAIL_RE.test(recipientEmail)) {
      return Response.json(
        { error: "Geçerli bir alıcı e-posta adresi gir." },
        { status: 400 }
      );
    }

    const { data: message, error: messageError } = await supabase
      .from("outreach_messages")
      .select("*, prospects(*)")
      .eq("id", outreachMessageId)
      .eq("user_id", user.id)
      .single();

    if (messageError || !message) {
      return Response.json({ error: "Mesaj bulunamadı." }, { status: 404 });
    }

    if (message.status === "sent") {
      return Response.json(
        { error: "Bu prospect'e zaten gönderim yapıldı." },
        { status: 409 }
      );
    }

    const { data: suppressed } = await supabase
      .from("suppression_list")
      .select("id")
      .eq("user_id", user.id)
      .eq("email", recipientEmail.toLowerCase())
      .maybeSingle();

    if (suppressed) {
      return Response.json(
        { error: "Bu alıcı iletişime geçilmeyecekler listesinde." },
        { status: 403 }
      );
    }

    if (message.prospect_id) {
      const { count: alreadySent } = await supabase
        .from("outreach_messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("prospect_id", message.prospect_id)
        .eq("status", "sent");

      if (alreadySent && alreadySent > 0) {
        return Response.json(
          { error: "Bu prospect'e zaten gönderim yapıldı." },
          { status: 409 }
        );
      }
    }

    const { count: sentToday, error: countError } = await supabase
      .from("outreach_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "sent")
      .gte("sent_at", todayStartIso());

    if (countError) throw countError;

    if ((sentToday || 0) >= DAILY_SEND_LIMIT) {
      return Response.json(
        { error: "Today's outreach limit has been reached." },
        { status: 429 }
      );
    }

    const { error: sendError } = await sendOutreachEmail({
      to: recipientEmail,
      subject,
      body: emailBody,
    });

    if (sendError) {
      await supabase
        .from("outreach_messages")
        .update({ status: "failed", recipient_email: recipientEmail, subject, body: emailBody })
        .eq("id", outreachMessageId);

      console.error("[marketing] send failed:", sendError.message);

      return Response.json(
        { error: "Email gönderilemedi. Lütfen tekrar deneyin." },
        { status: 502 }
      );
    }

    const prospect = message.prospects as any;
    let leadId: string | null = message.lead_id || null;

    if (prospect) {
      const { data: existingLead } = await supabase
        .from("leads")
        .select("id")
        .eq("user_id", user.id)
        .ilike("company", prospect.company_name)
        .maybeSingle();

      let nextFollowUp: string | null = null;
      if (followUpInDays) {
        const d = new Date();
        d.setDate(d.getDate() + followUpInDays);
        nextFollowUp = d.toISOString().slice(0, 10);
      }

      if (existingLead) {
        leadId = existingLead.id;
        await supabase
          .from("leads")
          .update({
            status: "Mesaj Gönderildi",
            ...(nextFollowUp ? { next_follow_up_at: nextFollowUp } : {}),
          })
          .eq("id", existingLead.id);
      } else {
        const { data: newLead } = await supabase
          .from("leads")
          .insert({
            name: prospect.decision_maker_name || prospect.company_name,
            company: prospect.company_name,
            need:
              [prospect.industry, prospect.location].filter(Boolean).join(" · ") ||
              "Prospect Finder ile bulundu.",
            notes: prospect.decision_maker_role
              ? `Karar verici: ${prospect.decision_maker_role}`
              : "",
            score: prospect.prospect_score,
            temperature: temperatureFor(prospect.prospect_score),
            reason: prospect.score_reason,
            message: emailBody,
            status: "Mesaj Gönderildi",
            next_follow_up_at: nextFollowUp,
          })
          .select()
          .single();

        leadId = newLead?.id || null;
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("outreach_messages")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipient_email: recipientEmail,
        subject,
        body: emailBody,
        lead_id: leadId,
      })
      .eq("id", outreachMessageId)
      .select()
      .single();

    if (updateError) throw updateError;

    return Response.json({ outreachMessage: updated });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Email gönderilirken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
