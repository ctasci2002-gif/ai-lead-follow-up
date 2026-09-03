"use client";

import { useEffect, useState } from "react";
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
  created_at: string;
};

type OutreachMessage = {
  id: string;
  prospect_id: string;
  recipient_email: string;
  subject: string;
  body: string;
  status: "draft" | "approved" | "sent" | "failed" | "skipped";
  lead_id: string | null;
};

function todayStartIso() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function MarketingPage() {
  const supabase = createClient();

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [drafts, setDrafts] = useState<Record<string, OutreachMessage>>({});
  const [recipients, setRecipients] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [followUpSetId, setFollowUpSetId] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data: prospectData } = await supabase
      .from("prospects")
      .select("*")
      .gte("created_at", todayStartIso())
      .order("prospect_score", { ascending: false });

    const list = (prospectData || []) as Prospect[];
    setProspects(list);

    const foundEmails: Record<string, string> = {};
    for (const p of list) {
      const email = p.decision_maker_email || p.company_email;
      if (email) foundEmails[p.id] = email;
    }
    setRecipients((prev) => ({ ...foundEmails, ...prev }));

    if (list.length > 0) {
      const { data: messageData } = await supabase
        .from("outreach_messages")
        .select("*")
        .in(
          "prospect_id",
          list.map((p) => p.id)
        );

      const byProspect: Record<string, OutreachMessage> = {};
      for (const m of (messageData || []) as OutreachMessage[]) {
        // keep the most relevant one (sent > draft) per prospect
        if (!byProspect[m.prospect_id] || m.status === "sent") {
          byProspect[m.prospect_id] = m;
        }
      }
      setDrafts(byProspect);
    }

    setLoading(false);
  }

  async function generateEmail(prospectId: string) {
    setGeneratingId(prospectId);
    setError("");

    try {
      const res = await fetch("/api/marketing/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Bir hata oluştu.");

      setDrafts((prev) => ({ ...prev, [prospectId]: data.outreachMessage }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setGeneratingId(null);
    }
  }

  async function sendEmail(prospectId: string) {
    const draft = drafts[prospectId];
    const recipientEmail = recipients[prospectId] || "";

    if (!draft) return;

    setSendingId(prospectId);
    setError("");

    try {
      const res = await fetch("/api/marketing/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outreachMessageId: draft.id,
          recipientEmail,
          subject: draft.subject,
          body: draft.body,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Bir hata oluştu.");

      setDrafts((prev) => ({ ...prev, [prospectId]: data.outreachMessage }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSendingId(null);
    }
  }

  async function setFollowUp(prospectId: string, days: number) {
    const draft = drafts[prospectId];
    if (!draft?.lead_id) return;

    const d = new Date();
    d.setDate(d.getDate() + days);

    await supabase
      .from("leads")
      .update({ next_follow_up_at: d.toISOString().slice(0, 10) })
      .eq("id", draft.lead_id);

    setFollowUpSetId((prev) => ({ ...prev, [prospectId]: true }));
  }

  async function suppress(prospectId: string) {
    const email = recipients[prospectId];
    if (!email) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("suppression_list").insert({
      user_id: user.id,
      email: email.toLowerCase(),
      reason: "Kullanıcı tarafından manuel işaretlendi",
    });

    setDrafts((prev) => {
      const next = { ...prev };
      delete next[prospectId];
      return next;
    });
  }

  const qualified = prospects.filter((p) => p.prospect_score >= 60);
  const ready = Object.values(drafts).filter(
    (m) => m.status === "draft" || m.status === "approved"
  ).length;
  const sent = Object.values(drafts).filter((m) => m.status === "sent").length;

  const high = prospects.filter((p) => p.prospect_score >= 80);
  const medium = prospects.filter(
    (p) => p.prospect_score >= 60 && p.prospect_score < 80
  );
  const low = prospects.filter((p) => p.prospect_score < 60);

  function ProspectCard({ p }: { p: Prospect }) {
    const draft = drafts[p.id];
    const isSent = draft?.status === "sent";

    return (
      <section className="card result-card">
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
              <a href={p.size_source} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "inherit" }}>
                Size Source
              </a>
            </>
          ) : (
            " (Unverified)"
          )}
        </div>

        <div className="temperature" style={{ marginTop: 8 }}>
          {p.decision_maker_name
            ? `Decision Maker: ${p.decision_maker_name}${p.decision_maker_role ? ` — ${p.decision_maker_role}` : ""}`
            : "Decision maker not found"}
        </div>

        <div className="temperature" style={{ marginTop: 8 }}>
          Recipient: {p.decision_maker_email || p.company_email || "Not found"}
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
                Source
              </a>
            </>
          )}
        </div>

        {!p.decision_maker_email && !p.company_email && (
          <p className="error" style={{ fontSize: 13 }}>
            Verified email bulunamadı. Bu prospect için email gönderimi
            devre dışı (alıcı adresini elle girmedikçe).
          </p>
        )}

        {p.website && (
          <p className="subtitle" style={{ marginTop: 12 }}>
            🌐{" "}
            <a
              href={p.website.startsWith("http") ? p.website : `https://${p.website}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {p.website}
            </a>
          </p>
        )}

        {!draft && (
          <button
            className="btn"
            type="button"
            style={{ marginTop: 16 }}
            disabled={generatingId === p.id}
            onClick={() => generateEmail(p.id)}
          >
            {generatingId === p.id ? "Email hazırlanıyor..." : "Email Oluştur"}
          </button>
        )}

        {draft && !isSent && (
          <div className="message-box" style={{ marginTop: 16 }}>
            <div className="field">
              <label>Subject</label>
              <input
                value={draft.subject}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [p.id]: { ...draft, subject: e.target.value },
                  }))
                }
              />
            </div>

            <div className="field">
              <label>Body</label>
              <textarea
                style={{ minHeight: 160 }}
                value={draft.body}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [p.id]: { ...draft, body: e.target.value },
                  }))
                }
              />
            </div>

            <div className="field">
              <label>Alıcı e-posta</label>
              <input
                type="email"
                placeholder="james@brightpixel.co.uk"
                value={recipients[p.id] || ""}
                onChange={(e) =>
                  setRecipients((prev) => ({ ...prev, [p.id]: e.target.value }))
                }
              />
            </div>

            {p.source_urls && p.source_urls.length > 0 && (
              <p className="subtitle" style={{ fontSize: 12 }}>
                Research Sources:{" "}
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

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <button
                className="btn"
                type="button"
                disabled={sendingId === p.id || !recipients[p.id]}
                onClick={() => sendEmail(p.id)}
              >
                {sendingId === p.id ? "Gönderiliyor..." : "✓ Onayla ve Gönder"}
              </button>

              <button className="btn" type="button" onClick={() => suppress(p.id)}>
                🚫 İletişime Geçme
              </button>
            </div>
          </div>
        )}

        {isSent && (
          <div className="message-box" style={{ marginTop: 16 }}>
            <strong>✅ Gönderildi</strong>
            <p style={{ marginTop: 8 }}>{draft.recipient_email}</p>

            {!followUpSetId[p.id] ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <span className="subtitle" style={{ margin: 0, alignSelf: "center" }}>
                  Sonraki takip:
                </span>
                {[3, 5, 7].map((days) => (
                  <button
                    key={days}
                    className="filter-tab"
                    type="button"
                    onClick={() => setFollowUp(p.id, days)}
                  >
                    {days} gün sonra
                  </button>
                ))}
              </div>
            ) : (
              <p className="subtitle" style={{ marginTop: 8 }}>
                Takip tarihi ayarlandı — Dashboard'dan görebilirsin.
              </p>
            )}
          </div>
        )}
      </section>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="topbar">
          <div>
            <span className="badge">🧠 AI Marketing Agent</span>
            <h1 className="title">Bugünün outreach'ini yönet.</h1>
            <p className="subtitle">
              Yeni müşterileri bul, kişiselleştirilmiş outreach hazırla ve
              satış takibini AI ile yönet.
            </p>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>{prospects.length}</strong>
              <span>Prospect</span>
            </div>
            <div className="stat">
              <strong>{qualified.length}</strong>
              <span>Uygun</span>
            </div>
            <div className="stat">
              <strong>{ready}</strong>
              <span>Outreach Hazır</span>
            </div>
            <div className="stat">
              <strong>{sent}</strong>
              <span>Gönderildi</span>
            </div>
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

        {error && (
          <section className="card">
            <p className="error" style={{ marginTop: 0 }}>
              {error}
            </p>
          </section>
        )}

        {!loading && prospects.length === 0 && (
          <section className="card">
            <h2>Bugün henüz prospect yok</h2>
            <p className="subtitle">
              Önce{" "}
              <Link href="/prospects" className="lp-link-btn">
                Prospect Finder
              </Link>{" "}
              ile bugün için yeni prospect bul.
            </p>
          </section>
        )}

        {high.length > 0 && (
          <>
            <h2>🔥 High Priority</h2>
            {high.map((p) => (
              <ProspectCard p={p} key={p.id} />
            ))}
          </>
        )}

        {medium.length > 0 && (
          <>
            <h2>🟡 Medium Priority</h2>
            {medium.map((p) => (
              <ProspectCard p={p} key={p.id} />
            ))}
          </>
        )}

        {low.length > 0 && (
          <>
            <h2>🔵 Low Priority</h2>
            {low.map((p) => (
              <ProspectCard p={p} key={p.id} />
            ))}
          </>
        )}
      </div>
    </main>
  );
}
