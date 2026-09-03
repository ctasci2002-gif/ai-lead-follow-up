"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

type AdminUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? "");

      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();

        if (res.status === 403) {
          setError("Bu sayfaya erişim yetkin yok.");
          return;
        }

        if (!res.ok) {
          throw new Error(data.error || "Bir hata oluştu.");
        }

        setUsers(data.users as AdminUser[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="page">
      <div className="container">
        <div className="topbar">
          <div>
            <span className="badge">Zappivot · Admin</span>
            <h1 className="title" style={{ fontSize: 32 }}>
              Kayıtlı Kullanıcılar
            </h1>
            <p className="subtitle">
              Supabase Authentication üzerinden hesap oluşturan tüm
              kullanıcılar.
            </p>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>{users.length}</strong>
              <span>Toplam Hesap</span>
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

          <Link href="/dashboard" className="lp-link-btn">
            ← Dashboard
          </Link>

          <button className="btn" type="button" onClick={signOut}>
            Çıkış yap
          </button>
        </div>

        <section className="card">
          {loading && <p className="subtitle">Yükleniyor...</p>}

          {!loading && error && <p className="error">{error}</p>}

          {!loading && !error && users.length === 0 && (
            <p className="subtitle">Henüz kayıtlı kullanıcı yok.</p>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>E-posta</th>
                    <th>Kayıt Tarihi</th>
                    <th>Son Giriş</th>
                    <th>Doğrulama</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email || "—"}</td>
                      <td>{formatDate(u.created_at)}</td>
                      <td>{formatDate(u.last_sign_in_at)}</td>
                      <td>
                        {u.email_confirmed_at ? (
                          <span className="followup-badge">Doğrulandı</span>
                        ) : (
                          <span className="followup-badge overdue">
                            Bekliyor
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
