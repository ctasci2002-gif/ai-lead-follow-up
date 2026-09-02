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
  created_at: string;
};

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
          </section>
        )}

        {leads.length > 0 && (
          <section className="card">
            <h2>Lead'ler</h2>

            <div className="lead-list">
              {leads.map((lead) => (
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