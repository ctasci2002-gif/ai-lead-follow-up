import { createRouteClient } from "../../../../lib/supabase/server";
import {
  searchCompanies,
  dedupeByDomain,
  analyzeProspects,
  extractDomain,
  parseSizeNumbers,
  extractEmail,
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

export async function GET() {
  try {
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { count: usedToday, error: countError } = await supabase
      .from("prospects")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStartIso());

    if (countError) throw countError;

    return Response.json({ used: usedToday || 0, limit: DAILY_LIMIT });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Kota bilgisi alınamadı." }, { status: 500 });
  }
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

    // Company size is intentionally NOT part of the search query — it's a
    // narrow, rarely-indexed phrase ("5-30 employees") that starves the
    // search engine of results. Claude gets it as scoring context instead
    // (see analyzeProspects), applied after search, not before.
    const query =
      freeText || [industry, "companies in", location].filter(Boolean).join(" ");

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

    // Oversample: directory/listicle pages get filtered out by Claude, and
    // duplicate-domain hits get filtered out by dedupe, so asking for exactly
    // `maxResults` raw hits often leaves too few (or zero) real companies
    // after filtering. Ask Tavily for more than we need, then trim the final
    // analyzed list back down to maxResults before inserting.
    const searchCount = Math.min(maxResults * 3, 20);

    console.log(
      "[prospects] query:",
      query,
      "| requested maxResults:",
      maxResults,
      "| search fetch count:",
      searchCount
    );

    const searchResults = await searchCompanies(query, searchCount);
    console.log("[prospects] raw search result count:", searchResults.length);
    console.log(
      "[prospects] raw results:",
      searchResults.map((r) => ({ title: r.title, url: r.url }))
    );

    const candidates = dedupeByDomain(
      searchResults,
      excludeDomains,
      excludeCompanyNames
    );
    console.log("[prospects] candidates after pre-dedupe:", candidates.length);

    if (candidates.length === 0) {
      console.log("[prospects] stopped: 0 candidates after pre-dedupe");
      return Response.json({ prospects: [] });
    }

    // Deterministic email discovery — scans each candidate's actual fetched
    // content for a literal email address (no AI, no guessing, no new
    // search call). Matched back onto analyzed prospects by source URL below.
    const candidateEmails = new Map<string, string>();
    for (const c of candidates) {
      const email = extractEmail(c.content);
      if (email) candidateEmails.set(c.url, email);
    }
    console.log(
      "[prospects] emails found in raw content:",
      candidateEmails.size,
      "/",
      candidates.length
    );

    const rawAnalyzed = await analyzeProspects(candidates, {
      location,
      industry,
      companySize,
    });
    console.log("[prospects] analyzed by Claude:", rawAnalyzed.length);

    // Trust nothing Claude says about size unless it points at a URL we
    // actually gave it — a hallucinated/off-list source_source is treated
    // exactly like no source at all.
    const candidateUrls = new Set(candidates.map((c) => c.url));

    const analyzedRaw = rawAnalyzed.map((p) => {
      const sourceIsReal = !!p.size_source && candidateUrls.has(p.size_source);
      const verified = !!p.company_size_verified && sourceIsReal;

      let companyEmail: string | null = null;
      let companyEmailSource: string | null = null;

      for (const url of p.source_urls || []) {
        const found = candidateEmails.get(url);
        if (found) {
          companyEmail = found;
          companyEmailSource = url;
          break;
        }
      }

      return {
        ...p,
        company_size: verified && p.company_size ? p.company_size : "Unknown",
        company_size_verified: verified,
        size_source: verified ? p.size_source : null,
        company_email: companyEmail,
        company_email_source: companyEmailSource,
        // Decision-maker personal emails are never fabricated or inferred
        // from a name+domain guess — only ever set if a future, stricter
        // signal justifies it. For now this stays honestly "not found".
        decision_maker_email: null,
      };
    });

    // Hard filter: if we VERIFIABLY know a company is bigger than the
    // user's target max size, drop it entirely — never show it as if it
    // might fit. Unverified sizes are never excluded on this basis (we
    // can't prove they're out of range either), just labeled "Unknown".
    const targetMaxSize = companySize
      ? Math.max(...parseSizeNumbers(companySize), 0) || null
      : null;

    const sizeFiltered = analyzedRaw.filter((p) => {
      if (!targetMaxSize || !p.company_size_verified) return true;
      const nums = parseSizeNumbers(p.company_size);
      const verifiedMin = nums.length ? Math.min(...nums) : null;
      if (verifiedMin !== null && verifiedMin > targetMaxSize) {
        console.log(
          "[prospects] excluded (verified size over target):",
          p.company_name,
          p.company_size
        );
        return false;
      }
      return true;
    });

    console.log("[prospects] after size filter:", sizeFiltered.length);

    // Second dedupe pass on Claude's extracted company_name/website: a repeat
    // search can surface a different source URL for a company we already
    // have (e.g. a different directory listing), which the pre-analysis
    // domain check above can't catch since it only sees the raw search hit.
    const seenInBatch = new Set<string>();

    const analyzed = sizeFiltered.filter((p) => {
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

    console.log("[prospects] after post-analysis dedupe:", analyzed.length);

    if (analyzed.length === 0) {
      console.log("[prospects] stopped: 0 after post-analysis dedupe");
      return Response.json({ prospects: [] });
    }

    // Trim back down to what the user asked for (and what the daily quota
    // allows) — oversampling above was only to give filtering enough room.
    analyzed.sort((a, b) => b.prospect_score - a.prospect_score);
    const finalResults = analyzed.slice(0, maxResults);
    console.log("[prospects] final count after trimming to maxResults:", finalResults.length);

    let emailsFound = 0;

    for (const p of finalResults) {
      if (p.company_email) emailsFound += 1;
      console.log(
        `[prospects] Company: ${p.company_name} | Company Size: ${p.company_size} | Size Source: ${p.size_source || "Unverified"} | Email: ${p.company_email || "Not found"} | Email Source: ${p.company_email_source || "-"} | Score: ${p.prospect_score}`
      );
    }

    console.log(
      `[prospects] emails found: ${emailsFound} / ${finalResults.length} not found: ${finalResults.length - emailsFound}`
    );

    const rows = finalResults.map((p) => ({
      user_id: user.id,
      company_name: p.company_name,
      website: p.website,
      location: p.location,
      industry: p.industry,
      company_size: p.company_size,
      size_source: p.size_source,
      company_email: p.company_email,
      company_email_source: p.company_email_source,
      decision_maker_name: p.decision_maker_name,
      decision_maker_role: p.decision_maker_role,
      decision_maker_email: p.decision_maker_email,
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
