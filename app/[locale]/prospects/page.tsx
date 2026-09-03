"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import { qualificationChips } from "../../../lib/qualification";
import { useDictionary } from "../../../lib/i18n/DictionaryProvider";
import { LocaleSwitcher } from "../../../lib/i18n/LocaleSwitcher";

type Prospect = {
  id: string;
  company_name: string;
  website: string | null;
  location: string | null;
  industry: string | null;
  company_size: string | null;
  size_source: string | null;
  company_email: string | null;
  company_email_source: string | null;
  decision_maker_name: string | null;
  decision_maker_role: string | null;
  decision_maker_email: string | null;
  prospect_score: number;
  score_reason: string;
  outreach_message: string;
  source_urls: string[];
};

type ScoreFilter = "all" | "high" | "medium" | "low";

function temperatureFor(score: number) {
  if (score >= 75) return "Sıcak";
  if (score >= 45) return "Ilık";
  return "Soğuk";
}

export default function ProspectsPage() {
  const supabase = createClient();
  const { locale } = useParams<{ locale: string }>();
  const dict = useDictionary();
  const t = dict.prospects;

  const [form, setForm] = useState({
    location: "",
    industry: "",
    companySize: "",
    freeText: "",
    resultsCount: 20,
  });

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState("");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [quota, setQuota] = useState<{ used: number; limit: number } | null>(
    null
  );
  const [lastSearch, setLastSearch] = useState({ industry: "", location: "" });

  useEffect(() => {
    fetch("/api/prospects/search")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setQuota({ used: data.used, limit: data.limit });
      })
      .catch(() => {});
  }, []);

  async function search(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setLoadingStage(0);
    setError("");

    const stageTimers = [
      setTimeout(() => setLoadingStage(1), 2500),
      setTimeout(() => setLoadingStage(2), 6000),
    ];

    try {
      const res = await fetch("/api/prospects/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.genericError);
      }

      setProspects(data.prospects || []);
      setLastSearch({ industry: form.industry, location: form.location });

      if (!data.prospects || data.prospects.length === 0) {
        setError(t.noResultsError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.genericError);
    } finally {
      stageTimers.forEach(clearTimeout);
      setLoading(false);

      fetch("/api/prospects/search")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setQuota({ used: data.used, limit: data.limit });
        })
        .catch(() => {});
    }
  }

  async function saveToLead(p: Prospect) {
    const { error: insertError } = await supabase.from("leads").insert({
      name: p.decision_maker_name || p.company_name,
      company: p.company_name,
      need: [p.industry, p.location].filter(Boolean).join(" · ") || "Prospect Finder ile bulundu.",
      notes: p.decision_maker_role
        ? `Karar verici: ${p.decision_maker_role}`
        : "",
      score: p.prospect_score,
      temperature: temperatureFor(p.prospect_score),
      reason: p.score_reason,
      message: p.outreach_message,
    });

    if (!insertError) {
      setSavedIds((prev) => new Set(prev).add(p.id));
    }
  }

  const filteredProspects = prospects.filter((p) => {
    if (scoreFilter === "all") return true;
    if (scoreFilter === "high") return p.prospect_score >= 80;
    if (scoreFilter === "medium")
      return p.prospect_score >= 60 && p.prospect_score < 80;
    return p.prospect_score < 60;
  });

  return (
    <main className="page">
      <div className="container">
        <div className="topbar">
          <div>
            <span className="badge">{t.badge}</span>
            <h1 className="title">{t.title}</h1>
            <p className="subtitle">{t.subtitle}</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {quota && (
            <span className="subtitle" style={{ margin: 0 }}>
              {quota.used} / {quota.limit} {t.quotaLabel}
            </span>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LocaleSwitcher />
            <Link href={`/${locale}/dashboard`} className="lp-link-btn">
              {t.backToDashboard}
            </Link>
          </div>
        </div>

        <section className="card">
          <h2>{t.searchSectionTitle}</h2>

          <form onSubmit={search}>
            <div className="grid">
              <div className="field">
                <label>{t.fieldLocation}</label>
                <input
                  placeholder="London, UK"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>{t.fieldIndustry}</label>
                <input
                  placeholder="Web Design Agency"
                  value={form.industry}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>{t.fieldCompanySize}</label>
                <input
                  placeholder="5-30 employees"
                  value={form.companySize}
                  onChange={(e) =>
                    setForm({ ...form, companySize: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>{t.fieldResultsCount}</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.resultsCount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      resultsCount: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="field full">
                <label>{t.fieldFreeText}</label>
                <input
                  placeholder={t.freeTextPlaceholder}
                  value={form.freeText}
                  onChange={(e) =>
                    setForm({ ...form, freeText: e.target.value })
                  }
                />
              </div>
            </div>

            <button className="btn" disabled={loading}>
              {loading ? t.loadingStages[loadingStage] : t.searchButton}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </section>

        {prospects.length > 0 && (
          <section className="card">
            <h2>
              {filteredProspects.length} {t.resultsFound}
            </h2>

            <div className="filter-tabs">
              {[
                { key: "all" as ScoreFilter, label: t.filterAll },
                { key: "high" as ScoreFilter, label: t.filterHigh },
                { key: "medium" as ScoreFilter, label: t.filterMedium },
                { key: "low" as ScoreFilter, label: t.filterLow },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={
                    scoreFilter === f.key ? "filter-tab active" : "filter-tab"
                  }
                  onClick={() => setScoreFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {filteredProspects.map((p) => (
          <section className="card result-card" key={p.id}>
            <div className="result-header">
              <div>
                <h2>{p.company_name}</h2>
                <p>{[p.location, p.industry].filter(Boolean).join(" · ")}</p>
              </div>

              <div className="score">
                <strong>{p.prospect_score}</strong>
                <span>/100</span>
              </div>
            </div>

            <div className="qual-chips">
              {qualificationChips(p, lastSearch).map((c) => (
                <span
                  key={c.label}
                  className={
                    c.ok === true
                      ? "qual-chip ok"
                      : c.ok === false
                      ? "qual-chip bad"
                      : "qual-chip neutral"
                  }
                >
                  {c.label}
                </span>
              ))}
            </div>

            <div className="temperature">
              {t.companySize}: {p.company_size || "Unknown"}
              {p.size_source && (
                <>
                  {" "}
                  ·{" "}
                  <a
                    href={p.size_source}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    style={{ color: "inherit" }}
                  >
                    {t.sizeSource}
                  </a>
                </>
              )}
            </div>

            <div className="temperature">
              {t.decisionMaker}:{" "}
              {p.decision_maker_name
                ? `${p.decision_maker_name}${
                    p.decision_maker_role ? ` — ${p.decision_maker_role}` : ""
                  }`
                : t.notFound}
            </div>

            <div className="temperature">
              {t.recipientEmail}:{" "}
              {p.decision_maker_email || p.company_email || t.notFound}
              {(p.decision_maker_email || p.company_email) && p.company_email_source && (
                <>
                  {" "}
                  ·{" "}
                  <a
                    href={p.company_email_source}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    style={{ color: "inherit" }}
                  >
                    {t.emailSource}
                  </a>
                </>
              )}
            </div>

            {p.website && (
              <p className="subtitle" style={{ marginTop: 12 }}>
                🌐{" "}
                <a
                  href={
                    p.website.startsWith("http")
                      ? p.website
                      : `https://${p.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {p.website}
                </a>
              </p>
            )}

            <div className="reason">
              <strong>{t.whyThisProspect}</strong>
              <p>{p.score_reason}</p>
            </div>

            <div className="message-box">
              <strong>{t.aiOutreach}</strong>
              <p>{p.outreach_message}</p>

              <button
                className="btn"
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(p.outreach_message)
                }
              >
                {t.copyMessage}
              </button>

              <button
                className="btn"
                type="button"
                style={{ marginLeft: 10 }}
                disabled={savedIds.has(p.id)}
                onClick={() => saveToLead(p)}
              >
                {savedIds.has(p.id) ? t.savedToLead : t.saveToLead}
              </button>
            </div>

            {p.source_urls && p.source_urls.length > 0 && (
              <p className="subtitle" style={{ marginTop: 16, fontSize: 12 }}>
                {t.source}:{" "}
                {p.source_urls.map((u, i) => (
                  <span key={u}>
                    <a href={u} target="_blank" rel="noopener noreferrer nofollow">
                      {u}
                    </a>
                    {i < p.source_urls.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
