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
  const [googleLoading, setGoogleLoading] = useState(false);

  async function signInWithGoogle() {
    setGoogleLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

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
              {mode === "signup" ? "Ücretsiz başla" : "Giriş yap"}
            </h1>
            <p className="subtitle">
              Lead dashboard'una erişmek için hesap oluştur.
            </p>
          </div>
        </div>

        <section className="card">
          <button
            type="button"
            className="btn-google"
            disabled={googleLoading}
            onClick={signInWithGoogle}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            {googleLoading ? "Yönlendiriliyor..." : "Google ile giriş yap"}
          </button>

          <div className="auth-divider">
            <span>veya</span>
          </div>

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
