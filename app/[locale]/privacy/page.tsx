import type { Metadata } from "next";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { privacyContent, legalContactEmail } from "../../../lib/i18n/legal-content";
import { LocaleSwitcher } from "../../../lib/i18n/LocaleSwitcher";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: `${dict.legal.privacyTitle} — Zappivot`,
    description: "How Zappivot collects, uses, and protects your data.",
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const content = privacyContent[locale] || privacyContent.en;

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="topbar">
          <div>
            <span className="badge">Zappivot</span>
            <h1 className="title" style={{ fontSize: 34 }}>
              {dict.legal.privacyTitle}
            </h1>
            <p className="subtitle">{dict.legal.privacyUpdated}</p>
          </div>
          <LocaleSwitcher />
        </div>

        <section className="card legal-content">
          <p>{content.intro}</p>

          {content.sections.map((s) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </div>
          ))}

          <h2>
            8.{" "}
            {locale === "tr" ? "İletişim" : locale === "de" ? "Kontakt" : "Contact"}
          </h2>
          <p>
            {content.contact}{" "}
            <a href={`mailto:${legalContactEmail}`}>{legalContactEmail}</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
