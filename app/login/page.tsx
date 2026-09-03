"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          setInfo("Hesap oluşturuldu. Giriş yapılıyor...");
          router.push("/dashboard");
          router.refresh();
        } else {
          // Supabase's "Confirm email" setting is on — signUp succeeds but
          // returns no session. Navigating away here would just bounce the
          // user straight back to /login via middleware before they ever
          // see this message, so stay put and tell them to check email.
          setInfo(
            "Hesap oluşturuldu. Giriş yapabilmek için e-postana gelen doğrulama linkine tıkla."
          );
        }
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
              {mode === "signin" ? "Giriş yap" : "Hesap oluştur"}
            </h1>
            <p className="subtitle">
              Lead dashboard'una erişmek için giriş yap.
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
                : mode === "signin"
                ? "Giriş yap"
                : "Hesap oluştur"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
          {info && <p className="subtitle">{info}</p>}

          <p className="subtitle" style={{ marginTop: 16 }}>
            {mode === "signin" ? (
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
            ) : (
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
            )}
          </p>
        </section>
      </div>
    </main>
  );
}
