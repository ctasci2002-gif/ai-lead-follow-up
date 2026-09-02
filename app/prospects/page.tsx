"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

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

const loadingStages = [
  "Prospectler aranıyor...",
  "Şirketler analiz ediliyor...",
  "AI fırsatları değerlendiriyor...",
];

function temperatureFor(score: number) {
  if (score >= 75) return "Sıcak";
  if (score >= 45) return "Ilık";
  return "Soğuk";
}

export default function ProspectsPage() {
  const supabase = createClient();

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
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setProspects(data.prospects || []);

      if (!data.prospects || data.prospects.length === 0) {
        setError("Bu kriterlerle uygun prospect bulunamadı.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      stageTimers.forEach(clearTimeout);
      setLoading(false);
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
            <span className="badge">AI Prospect Finder</span>
            <h1 className="title">Yeni Müşteriler Bul</h1>
            <p className="subtitle">
              Satış yapmak istediğin şirketleri bul, AI ile analiz et ve
              outreach'e hazır hale getir.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 20,
          }}
        >
          <Link href="/dashboard" className="lp-link-btn">
            ← Dashboard'a dön
          </Link>
        </div>

        <section className="card">
          <h2>Prospect Ara</h2>

          <form onSubmit={search}>
            <div className="grid">
              <div className="field">
                <label>Location</label>
                <input
                  placeholder="London, UK"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Industry</label>
                <input
                  placeholder="Web Design Agency"
                  value={form.industry}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Company Size</label>
                <input
                  placeholder="5-30 employees"
                  value={form.companySize}
                  onChange={(e) =>
                    setForm({ ...form, companySize: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Number of Results</label>
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
                <label>
                  Veya kendi arama kriterini yaz (üsttekilerin yerine geçer)
                </label>
                <input
                  placeholder="New York'ta B2B SaaS şirketleri bul"
                  value={form.freeText}
                  onChange={(e) =>
                    setForm({ ...form, freeText: e.target.value })
                  }
                />
              </div>
            </div>

            <button className="btn" disabled={loading}>
              {loading ? loadingStages[loadingStage] : "Prospect Bul"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </section>

        {prospects.length > 0 && (
          <section className="card">
            <h2>{filteredProspects.length} Prospects Found</h2>

            <div className="filter-tabs">
              {[
                { key: "all" as ScoreFilter, label: "All" },
                { key: "high" as ScoreFilter, label: "80+ High" },
                { key: "medium" as ScoreFilter, label: "60-79 Medium" },
                { key: "low" as ScoreFilter, label: "Below 60 Low" },
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

            <div className="temperature">
              Company Size: {p.company_size || "Unknown"}
              {p.size_source ? (
                <>
                  {" "}
                  ·{" "}
                  <a
                    href={p.size_source}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    style={{ color: "inherit" }}
                  >
                    Size Source
                  </a>
                </>
              ) : (
                " (Unverified)"
              )}
            </div>

            {p.decision_maker_name && (
              <div className="temperature">
                Decision Maker: {p.decision_maker_name}
                {p.decision_maker_role ? ` — ${p.decision_maker_role}` : ""}
              </div>
            )}

            <div className="temperature">
              Recipient Email:{" "}
              {p.decision_maker_email || p.company_email || "Not found"}
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
                    Email Source
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
              <strong>Why this prospect?</strong>
              <p>{p.score_reason}</p>
            </div>

            <div className="message-box">
              <strong>AI Outreach</strong>
              <p>{p.outreach_message}</p>

              <button
                className="btn"
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(p.outreach_message)
                }
              >
                Mesajı Kopyala
              </button>

              <button
                className="btn"
                type="button"
                style={{ marginLeft: 10 }}
                disabled={savedIds.has(p.id)}
                onClick={() => saveToLead(p)}
              >
                {savedIds.has(p.id) ? "Lead'e Kaydedildi ✓" : "Lead'e Kaydet"}
              </button>
            </div>

            {p.source_urls && p.source_urls.length > 0 && (
              <p className="subtitle" style={{ marginTop: 16, fontSize: 12 }}>
                Source:{" "}
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
