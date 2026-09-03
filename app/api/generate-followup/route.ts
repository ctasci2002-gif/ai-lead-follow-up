import Anthropic from "@anthropic-ai/sdk";
import { createRouteClient } from "../../../lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, company, need, notes } = await req.json();

    if (!name || !company || !need) {
      return Response.json(
        { error: "Lead adı, şirket ve ihtiyaç alanları zorunlu." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY || !process.env.ANTHROPIC_MODEL) {
      return Response.json(
        { error: "Anthropic environment variables eksik." },
        { status: 500 }
      );
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL,
      max_tokens: 700,

      system: `
Sen bir satış CRM'i içinde çalışan yapay zeka satış asistanısın.

Görevin:
1. Lead'i 0-100 arasında puanla.
2. Lead'in sıcaklığını belirle:
   - Sıcak
   - Ilık
   - Soğuk
3. Satın alma ihtimalini kısa şekilde açıkla.
4. Lead'e gönderilmeye hazır doğal bir Türkçe follow-up mesajı oluştur.

Kurallar:
- Verilmeyen bilgileri uydurma.
- Mesajda "taslak", "AI", "yapay zeka" veya sistem açıklaması kullanma.
- Markdown kullanma.
- Follow-up mesajı 60-90 kelime arasında olsun.
- Çıktıyı SADECE aşağıdaki JSON formatında döndür:

{
  "score": 0,
  "temperature": "Sıcak",
  "reason": "Kısa açıklama",
  "message": "Gönderilmeye hazır mesaj"
}
`,

      messages: [
        {
          role: "user",
          content: `Lead adı: ${name}
Şirket: ${company}
İhtiyaç / konuşma özeti: ${need}
Ek notlar: ${notes || "Yok"}

Bu lead'i analiz et ve JSON formatında sonuç döndür.`,
        },
      ],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(cleaned);

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Claude ile lead analizi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}