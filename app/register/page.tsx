"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setInfo("Hesap oluşturuldu. Giriş yapılıyor...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="topbar">
          <div>
            <span className="badge">AI Lead Follow-Up · MVP</span>
            <h1 className="title" style={{ fontSize: 32 }}>
              {mode === "signup" ? "Ücretsiz başla" : "Giriş yap"}
            </h1>
            <p className="subtitle">
              Lead dashboard'una erişmek için hesap oluştur.
            </p>
          </div>
        </div>

        <section className="card">
          <form onSubmit={submit}>
            <div className="field">
              <label>E-posta</label>
              <input
                required
                type="email"
                placeholder="ornek@sirket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Şifre</label>
              <input
                required
                type="password"
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn" disabled={loading}>
              {loading
                ? "İşleniyor..."
                : mode === "signup"
                ? "Hesap oluştur"
                : "Giriş yap"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
          {info && <p className="subtitle">{info}</p>}

          <p className="subtitle" style={{ marginTop: 16 }}>
            {mode === "signup" ? (
              <>
                Zaten hesabın var mı?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("signin");
                    setError("");
                  }}
                >
                  Giriş yap
                </a>
              </>
            ) : (
              <>
                Hesabın yok mu?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode("signup");
                    setError("");
                  }}
                >
                  Hesap oluştur
                </a>
              </>
            )}
          </p>
        </section>
      </div>
    </main>
  );
}
