"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

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

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

type FollowUpFilter = "all" | "today" | "overdue" | "upcoming";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    need: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [followUpFilter, setFollowUpFilter] = useState<FollowUpFilter>("all");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? "");

      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setLeads(data as Lead[]);
      }
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

  const dueLeads = leads
    .filter((lead) => lead.next_follow_up_at && lead.next_follow_up_at <= today)
    .sort((a, b) =>
      (a.next_follow_up_at as string).localeCompare(b.next_follow_up_at as string)
    );

  const followUpFilters: { key: FollowUpFilter; label: string }[] = [
    { key: "all", label: "Tümü" },
    { key: "today", label: "Bugün" },
    { key: "overdue", label: "Geciken" },
    { key: "upcoming", label: "Gelecek" },
  ];

  const filteredLeads = leads.filter((lead) => {
    if (followUpFilter === "all") return true;
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
            <span className="badge">AI Lead Follow-Up · MVP</span>
            <h1 className="title">Lead Dashboard</h1>
            <p className="subtitle">
              Lead'lerini analiz et, önceliklendir ve kişiselleştirilmiş
              follow-up mesajları oluştur.
            </p>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>{leads.length}</strong>
              <span>Toplam Lead</span>
            </div>

            <div className="stat">
              <strong>
                {leads.filter((x) => x.temperature === "Sıcak").length}
              </strong>
              <span>Sıcak Lead</span>
            </div>

            <div className="stat">
              <strong>{dueLeads.length}</strong>
              <span>Bugün Takip</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {userEmail && (
            <span className="subtitle" style={{ margin: 0 }}>
              {userEmail}
            </span>
          )}

          <button className="btn" type="button" onClick={signOut}>
            Çıkış yap
          </button>
        </div>

        {dueLeads.length > 0 && (
          <section className="card result-card">
            <h2>📅 Bugün Takip Edilecek Lead'ler</h2>

            <div className="lead-list">
              {dueLeads.map((lead) => (
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
                    <span
                      className={
                        lead.next_follow_up_at! < today
                          ? "followup-badge overdue"
                          : "followup-badge today"
                      }
                    >
                      {lead.next_follow_up_at! < today
                        ? `Gecikti · ${lead.next_follow_up_at}`
                        : "Bugün"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="card">
          <h2>+ Yeni Lead</h2>

          <form onSubmit={generate}>
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
              {loading
                ? "Claude lead'i analiz ediyor..."
                : "Lead'i analiz et"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
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

        {leads.length > 0 && (
          <section className="card">
            <h2>Lead'ler</h2>

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
                Bu filtrede lead yok.
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
        )}

      </div>
    </main>
  );
}