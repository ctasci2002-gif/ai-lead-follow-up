"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

type Lead = {
  id: string;
  name: string;
  company: string;
  need: string;
  notes: string;
  score: number;
  temperature: string;
  reason: string;
  message: string;
  next_follow_up_at: string | null;
  created_at: string;
};

type Prospect = {
  id: string;
  company_name: string;
  location: string | null;
  industry: string | null;
  prospect_score: number;
  decision_maker_name: string | null;
  decision_maker_email: string | null;
  company_email: string | null;
  created_at: string;
};

type OutreachStatus = "sent" | "draft" | "none";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function scoreTier(score: number) {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

type FollowUpFilter = "all" | "today" | "overdue" | "upcoming";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [recentProspects, setRecentProspects] = useState<Prospect[]>([]);
  const [outreachStatus, setOutreachStatus] = useState<
    Record<string, OutreachStatus>
  >({});

  const [showManualForm, setShowManualForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    need: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [followUpFilter, setFollowUpFilter] = useState<FollowUpFilter>("all");

  const [prospectStats, setProspectStats] = useState({
    prospectsFound: 0,
    qualified: 0,
    contactsFound: 0,
    emailsGenerated: 0,
    emailsSent: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? "");

      fetch("/api/admin/check")
        .then((res) => setIsAdmin(res.ok))
        .catch(() => {});

      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setLeads(data as Lead[]);
      }

      const { data: prospectsData } = await supabase
        .from("prospects")
        .select(
          "id, company_name, location, industry, prospect_score, decision_maker_name, decision_maker_email, company_email, created_at"
        )
        .order("created_at", { ascending: false });

      const allProspects = (prospectsData as Prospect[]) || [];
      setRecentProspects(allProspects.slice(0, 8));

      const { data: messagesData } = await supabase
        .from("outreach_messages")
        .select("prospect_id, status");

      const messages = messagesData || [];

      const statusMap: Record<string, OutreachStatus> = {};
      for (const m of messages) {
        if (statusMap[m.prospect_id] !== "sent") {
          statusMap[m.prospect_id] = m.status === "sent" ? "sent" : "draft";
        }
      }
      setOutreachStatus(statusMap);

      setProspectStats({
        prospectsFound: allProspects.length,
        qualified: allProspects.filter((p) => p.prospect_score >= 60).length,
        contactsFound: allProspects.filter(
          (p) => p.decision_maker_email || p.company_email
        ).length,
        emailsGenerated: messages.length,
        emailsSent: messages.filter((m) => m.status === "sent").length,
      });
      setStatsLoading(false);
    }

    load();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function generate(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-followup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      const { data: inserted, error: insertError } = await supabase
        .from("leads")
        .insert({
          name: form.name,
          company: form.company,
          need: form.need,
          notes: form.notes,
          score: data.score,
          temperature: data.temperature,
          reason: data.reason,
          message: data.message,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newLead = inserted as Lead;
      const updated = [newLead, ...leads];

      setLeads(updated);
      setSelectedLead(newLead);

      setForm({
        name: "",
        company: "",
        need: "",
        notes: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteLead(id: string) {
    const updated = leads.filter((lead) => lead.id !== id);
    setLeads(updated);

    if (selectedLead?.id === id) {
      setSelectedLead(null);
    }

    await supabase.from("leads").delete().eq("id", id);
  }

  async function updateFollowUp(id: string, date: string) {
    const value = date || null;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, next_follow_up_at: value } : lead
      )
    );

    setSelectedLead((prev) =>
      prev && prev.id === id ? { ...prev, next_follow_up_at: value } : prev
    );

    await supabase
      .from("leads")
      .update({ next_follow_up_at: value })
      .eq("id", id);
  }

  const today = todayStr();

  const followUpFilters: { key: FollowUpFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "overdue", label: "Overdue" },
    { key: "upcoming", label: "Upcoming" },
  ];

  const filteredLeads = leads.filter((lead) => {
    if (followUpFilter === "all") return !!lead.next_follow_up_at;
    if (!lead.next_follow_up_at) return false;
    if (followUpFilter === "today") return lead.next_follow_up_at === today;
    if (followUpFilter === "overdue") return lead.next_follow_up_at < today;
    return lead.next_follow_up_at > today;
  });

  return (
    <main className="page">
      <div className="container">
        <div className="topbar">
          <div>
            <span className="badge">Zappivot</span>
            <h1 className="title">Dashboard</h1>
            <p className="subtitle">
              Find qualified prospects, discover decision-makers, and turn
              them into conversations.
            </p>
          </div>
        </div>

        <nav className="dash-nav">
          <div className="dash-nav-links">
            <Link href="/prospects" className="lp-link-btn">
              Prospects
            </Link>
            <Link href="/marketing" className="lp-link-btn">
              Marketing
            </Link>
            {isAdmin && (
              <Link href="/admin" className="lp-link-btn">
                Admin
              </Link>
            )}
          </div>

          <div className="dash-nav-account">
            {userEmail && <span className="dash-user-email">{userEmail}</span>}
            <button className="lp-link-btn" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </nav>

        <section className="card">
          <h2>Overview</h2>

          <div className="stats" style={{ flexWrap: "wrap" }}>
            <div className="stat">
              <strong>{statsLoading ? "—" : prospectStats.prospectsFound}</strong>
              <span>Prospects Found</span>
            </div>
            <div className="stat">
              <strong>{statsLoading ? "—" : prospectStats.qualified}</strong>
              <span>Qualified</span>
            </div>
            <div className="stat">
              <strong>{statsLoading ? "—" : prospectStats.contactsFound}</strong>
              <span>Contacts Found</span>
            </div>
            <div className="stat">
              <strong>{statsLoading ? "—" : prospectStats.emailsSent}</strong>
              <span>Emails Sent</span>
            </div>
            <div className="stat">
              <strong>{statsLoading ? "—" : prospectStats.emailsGenerated}</strong>
              <span>Emails Generated</span>
            </div>
          </div>
        </section>

        <section className="card dash-primary-cta">
          <h2>Find your next best prospects.</h2>
          <p className="subtitle">
            Tell Zappivot who you&apos;re looking for and discover companies
            that match your ideal customer profile.
          </p>
          <Link href="/prospects" className="btn lp-btn-lg">
            Find Prospects
          </Link>
        </section>

        <section className="card">
          <h2>Recent Prospects</h2>

          {recentProspects.length === 0 ? (
            <>
              <p className="subtitle" style={{ marginBottom: 4 }}>
                Your pipeline starts here.
              </p>
              <p className="subtitle" style={{ marginBottom: 16 }}>
                Find your first qualified prospects with Zappivot.
              </p>
              <Link href="/prospects" className="btn" style={{ display: "inline-block" }}>
                Find Prospects
              </Link>
            </>
          ) : (
            <div className="lead-list">
              {recentProspects.map((p) => {
                const emailFound = !!(p.decision_maker_email || p.company_email);
                const status = outreachStatus[p.id] || "none";

                return (
                  <div className="lead prospect-row" key={p.id}>
                    <div>
                      <strong>{p.company_name}</strong>
                      <span>
                        {[p.location, p.industry].filter(Boolean).join(" · ") ||
                          "Location/industry unknown"}
                      </span>
                    </div>

                    <div className="lead-right">
                      <span className={`score-badge ${scoreTier(p.prospect_score)}`}>
                        {p.prospect_score}
                      </span>
                      <span>{p.decision_maker_name || "No decision maker"}</span>
                      <span>{emailFound ? "Email found" : "Email not found"}</span>
                      <span
                        className={
                          status === "sent"
                            ? "followup-badge"
                            : status === "draft"
                            ? "followup-badge today"
                            : "followup-badge upcoming"
                        }
                      >
                        {status === "sent"
                          ? "Sent"
                          : status === "draft"
                          ? "Draft"
                          : "Not contacted"}
                      </span>
                      <Link href="/prospects" className="lp-link-btn">
                        View Prospect
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Follow-ups</h2>

          <div className="filter-tabs">
            {followUpFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                className={
                  followUpFilter === f.key
                    ? "filter-tab active"
                    : "filter-tab"
                }
                onClick={() => setFollowUpFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <p className="subtitle" style={{ padding: "16px 0" }}>
              No follow-ups in this filter.
            </p>
          )}

          <div className="lead-list">
            {filteredLeads.map((lead) => (
              <div
                className="lead"
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
              >
                <div>
                  <strong>{lead.name}</strong>
                  <span>{lead.company}</span>
                </div>

                <div className="lead-right">
                  {lead.next_follow_up_at && (
                    <span
                      className={
                        lead.next_follow_up_at < today
                          ? "followup-badge overdue"
                          : lead.next_follow_up_at === today
                          ? "followup-badge today"
                          : "followup-badge upcoming"
                      }
                    >
                      {lead.next_follow_up_at}
                    </span>
                  )}

                  <span>
                    {lead.temperature === "Sıcak"
                      ? "🔥"
                      : lead.temperature === "Ilık"
                      ? "🟡"
                      : "🔵"}{" "}
                    {lead.score}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLead(lead.id);
                    }}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedLead && (
          <section className="card result-card">
            <div className="result-header">
              <div>
                <h2>{selectedLead.name}</h2>
                <p>{selectedLead.company}</p>
              </div>

              <div className="score">
                <strong>{selectedLead.score}</strong>
                <span>/100</span>
              </div>
            </div>

            <div className="temperature">
              {selectedLead.temperature === "Sıcak"
                ? "🔥"
                : selectedLead.temperature === "Ilık"
                ? "🟡"
                : "🔵"}{" "}
              {selectedLead.temperature}
            </div>

            <div className="reason">
              <strong>AI Analizi</strong>
              <p>{selectedLead.reason}</p>
            </div>

            <div className="message-box">
              <strong>Önerilen Follow-up</strong>
              <p>{selectedLead.message}</p>

              <button
                className="btn"
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(selectedLead.message)
                }
              >
                Mesajı Kopyala
              </button>
            </div>

            <div className="field" style={{ marginTop: 20, marginBottom: 0 }}>
              <label>Sonraki takip tarihi</label>

              <input
                type="date"
                value={selectedLead.next_follow_up_at ?? ""}
                onChange={(e) =>
                  updateFollowUp(selectedLead.id, e.target.value)
                }
              />
            </div>
          </section>
        )}

        <section className="card">
          <button
            type="button"
            className="lp-link-btn"
            onClick={() => setShowManualForm((s) => !s)}
          >
            {showManualForm ? "− Hide" : "+ Add Prospect Manually"}
          </button>

          {showManualForm && (
            <form onSubmit={generate} style={{ marginTop: 20 }}>
              <div className="grid">
                <div className="field">
                  <label>Lead adı</label>

                  <input
                    required
                    placeholder="Ahmet Yılmaz"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="field">
                  <label>Şirket</label>

                  <input
                    required
                    placeholder="ABC İnşaat"
                    value={form.company}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        company: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="field full">
                  <label>İhtiyaç / konuşma özeti</label>

                  <textarea
                    required
                    placeholder="Web sitesi yenilemek istiyor..."
                    value={form.need}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        need: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="field full">
                  <label>Ek notlar</label>

                  <textarea
                    placeholder="Bütçe, zamanlama, karar verici vb."
                    value={form.notes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button className="btn" disabled={loading}>
                {loading ? "Analyzing prospect..." : "Analyze Prospect"}
              </button>
            </form>
          )}

          {error && <p className="error">{error}</p>}
        </section>
      </div>
    </main>
  );
}
