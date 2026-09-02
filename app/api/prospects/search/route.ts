import { createRouteClient } from "../../../../lib/supabase/server";
import {
  searchCompanies,
  dedupeByDomain,
  analyzeProspects,
  extractDomain,
} from "../../../../lib/prospects";

const DAILY_LIMIT = 20;

function todayStartIso() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function clampString(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
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

    if (!process.env.TAVILY_API_KEY || !process.env.ANTHROPIC_API_KEY) {
      console.error("Prospect search: missing TAVILY_API_KEY or ANTHROPIC_API_KEY");
      return Response.json(
        { error: "Prospect arama şu anda kullanılamıyor." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const location = clampString(body.location, 200);
    const industry = clampString(body.industry, 200);
    const companySize = clampString(body.companySize, 100);
    const freeText = clampString(body.freeText, 400);

    const requestedCount = Math.min(
      Math.max(parseInt(body.resultsCount, 10) || 10, 1),
      20
    );

    if (!freeText && !location && !industry) {
      return Response.json(
        { error: "Lütfen en az bir arama kriteri gir." },
        { status: 400 }
      );
    }

    const { count: usedToday, error: countError } = await supabase
      .from("prospects")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStartIso());

    if (countError) throw countError;

    const remaining = DAILY_LIMIT - (usedToday || 0);

    if (remaining <= 0) {
      return Response.json(
        { error: "Bugünkü prospect limitine ulaştın." },
        { status: 429 }
      );
    }

    const maxResults = Math.min(requestedCount, remaining);

    const query =
      freeText ||
      [industry, "companies in", location, companySize && `(${companySize} employees)`]
        .filter(Boolean)
        .join(" ");

    const [{ data: existingProspects }, { data: existingLeads }] =
      await Promise.all([
        supabase
          .from("prospects")
          .select("website, company_name")
          .eq("user_id", user.id),
        supabase.from("leads").select("company").eq("user_id", user.id),
      ]);

    const excludeDomains = new Set(
      (existingProspects || [])
        .map((p) => (p.website ? extractDomain(p.website) : null))
        .filter((d): d is string => !!d)
    );

    const excludeCompanyNames = new Set(
      [
        ...(existingProspects || []).map((p) => p.company_name?.toLowerCase()),
        ...(existingLeads || []).map((l) => l.company?.toLowerCase()),
      ].filter((n): n is string => !!n)
    );

    const searchResults = await searchCompanies(query, maxResults);
    const candidates = dedupeByDomain(
      searchResults,
      excludeDomains,
      excludeCompanyNames
    );

    if (candidates.length === 0) {
      return Response.json({ prospects: [] });
    }

    const analyzedRaw = await analyzeProspects(candidates);

    // Second dedupe pass on Claude's extracted company_name/website: a repeat
    // search can surface a different source URL for a company we already
    // have (e.g. a different directory listing), which the pre-analysis
    // domain check above can't catch since it only sees the raw search hit.
    const seenInBatch = new Set<string>();

    const analyzed = analyzedRaw.filter((p) => {
      const domain = p.website ? extractDomain(p.website) : null;
      const nameKey = (p.company_name || "").toLowerCase().trim();

      if (domain) {
        if (excludeDomains.has(domain) || seenInBatch.has(domain)) return false;
      } else if (nameKey && excludeCompanyNames.has(nameKey)) {
        return false;
      }

      if (domain) seenInBatch.add(domain);
      return true;
    });

    if (analyzed.length === 0) {
      return Response.json({ prospects: [] });
    }

    const rows = analyzed.map((p) => ({
      user_id: user.id,
      company_name: p.company_name,
      website: p.website,
      location: p.location,
      industry: p.industry,
      company_size: p.company_size,
      decision_maker_name: p.decision_maker_name,
      decision_maker_role: p.decision_maker_role,
      prospect_score: p.prospect_score,
      score_reason: p.score_reason,
      outreach_message: p.outreach_message,
      source_urls: p.source_urls || [],
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("prospects")
      .insert(rows)
      .select();

    if (insertError) throw insertError;

    return Response.json({ prospects: inserted });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Prospectler şu anda bulunamadı. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
