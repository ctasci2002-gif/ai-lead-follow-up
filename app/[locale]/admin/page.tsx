"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import { useDictionary } from "../../../lib/i18n/DictionaryProvider";
import { LocaleSwitcher } from "../../../lib/i18n/LocaleSwitcher";

type AdminUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
};

function formatDate(value: string | null, locale: string) {
  if (!value) return "—";
  const localeMap: Record<string, string> = {
    en: "en-GB",
    tr: "tr-TR",
    de: "de-DE",
  };
  return new Date(value).toLocaleString(localeMap[locale] || "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const { locale } = useParams<{ locale: string }>();
  const dict = useDictionary();
  const t = dict.admin;

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
          setError(t.forbidden);
          return;
        }

        if (!res.ok) {
          throw new Error(data.error || t.genericError);
        }

        setUsers(data.users as AdminUser[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.genericError);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <main className="page">
      <div className="container">
        <div className="topbar">
          <div>
            <span className="badge">{t.badge}</span>
            <h1 className="title" style={{ fontSize: 32 }}>
              {t.title}
            </h1>
            <p className="subtitle">{t.subtitle}</p>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>{users.length}</strong>
              <span>{t.statTotalAccounts}</span>
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
          <LocaleSwitcher />

          {userEmail && (
            <span className="subtitle" style={{ margin: 0 }}>
              {userEmail}
            </span>
          )}

          <Link href={`/${locale}/dashboard`} className="lp-link-btn">
            {t.backToDashboard}
          </Link>

          <button className="btn" type="button" onClick={signOut}>
            {t.signOut}
          </button>
        </div>

        <section className="card">
          {loading && <p className="subtitle">{t.loading}</p>}

          {!loading && error && <p className="error">{error}</p>}

          {!loading && !error && users.length === 0 && (
            <p className="subtitle">{t.noUsers}</p>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t.colEmail}</th>
                    <th>{t.colCreated}</th>
                    <th>{t.colLastSignIn}</th>
                    <th>{t.colVerification}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email || "—"}</td>
                      <td>{formatDate(u.created_at, locale)}</td>
                      <td>{formatDate(u.last_sign_in_at, locale)}</td>
                      <td>
                        {u.email_confirmed_at ? (
                          <span className="followup-badge">{t.verified}</span>
                        ) : (
                          <span className="followup-badge overdue">
                            {t.pending}
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
