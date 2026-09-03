import { createRouteClient } from "../../../../lib/supabase/server";
import { generateOutreachEmail, type Prospect } from "../../../../lib/marketing";

export async function POST(req: Request) {
  try {
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("Marketing generate-email: missing ANTHROPIC_API_KEY");
      return Response.json(
        { error: "Email oluşturma şu anda kullanılamıyor." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const prospectId = typeof body.prospectId === "string" ? body.prospectId : "";

    if (!prospectId) {
      return Response.json({ error: "prospectId gerekli." }, { status: 400 });
    }

    const { data: prospect, error: prospectError } = await supabase
      .from("prospects")
      .select("*")
      .eq("id", prospectId)
      .eq("user_id", user.id)
      .single();

    if (prospectError || !prospect) {
      return Response.json({ error: "Prospect bulunamadı." }, { status: 404 });
    }

    const { subject, body: emailBody } = await generateOutreachEmail(
      prospect as Prospect,
      user.email || "Zappivot"
    );

    const { data: inserted, error: insertError } = await supabase
      .from("outreach_messages")
      .insert({
        user_id: user.id,
        prospect_id: prospect.id,
        recipient_email: "",
        subject,
        body: emailBody,
        status: "draft",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return Response.json({ outreachMessage: inserted });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Email oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
