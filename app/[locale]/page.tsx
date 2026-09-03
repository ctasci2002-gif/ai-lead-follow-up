import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "../FaqAccordion";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import { LocaleSwitcher } from "../../lib/i18n/LocaleSwitcher";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const title = `Zappivot — ${dict.landing.heroTitle}`;
  const description = dict.landing.heroSubtitle;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", siteName: "Zappivot" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      className="lp-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const icons = {
  search: "M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM21 21l-5.2-5.2",
  users:
    "M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M17 8a3 3 0 1 1 0 6M17 14c2.8 0 5 2 5 6",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  building:
    "M4 21V7l8-4 8 4v14M9 21v-6h6v6M9 11h.01M9 15h.01M15 11h.01M15 15h.01",
  clock: "M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  target:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  message:
    "M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.34-.27-3.36-.75L3 20l1.02-4.08A8.5 8.5 0 1 1 21 11.5Z",
  chart: "M4 20V10M10 20V4M16 20v-7M4 20h16",
  check: "M5 12l4 4 10-10",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z",
};

const problemIcons = [icons.search, icons.clock, icons.users, icons.message];
const solutionIcons = [icons.search, icons.users, icons.mail];
const workflowIcons = [icons.target, icons.search, icons.users, icons.mail];
const agentIcons = [icons.building, icons.users, icons.globe, icons.mail, icons.target];
const whyIcons = [icons.clock, icons.target, icons.message];

function ScoreBadge({ score }: { score: number }) {
  const tier = score >= 80 ? "high" : score >= 60 ? "medium" : "low";
  return <span className={`score-badge ${tier}`}>{score}</span>;
}

function ProspectCardMockup({
  company,
  location,
  employees,
  industry,
  score,
}: {
  company: string;
  location: string;
  employees: string;
  industry: string;
  score: number;
}) {
  return (
    <div className="lp-prospect-row">
      <div className="lp-prospect-main">
        <strong>{company}</strong>
        <span>
          {location} · {employees} · {industry}
        </span>
      </div>
      <ScoreBadge score={score} />
    </div>
  );
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const d = dict.landing;

  return (
    <>
      <main className="lp-page">
        <nav className="lp-nav">
          <div className="lp-nav-inner">
            <span className="lp-brand">Zappivot</span>

            <div className="lp-nav-links">
              <a href="#features">{d.navFeatures}</a>
              <a href="#how-it-works">{d.navHow}</a>
              <a href="#pricing">{d.navPricing}</a>
              <a href="#faq">{d.navFaq}</a>
            </div>

            <div className="lp-nav-actions">
              <LocaleSwitcher />
              <Link href={`/${locale}/login`} className="lp-link-btn">
                {d.navLogin}
              </Link>
              <Link href={`/${locale}/register`} className="btn">
                {d.navCta}
              </Link>
            </div>
          </div>
        </nav>

        <section className="lp-hero">
          <div className="lp-hero-text">
            <span className="badge">{d.heroBadge}</span>

            <h1 className="lp-hero-title">{d.heroTitle}</h1>

            <p className="lp-hero-subtitle">{d.heroSubtitle}</p>

            <div className="lp-hero-actions">
              <Link href={`/${locale}/register`} className="btn lp-btn-lg">
                {d.heroCtaPrimary}
              </Link>
              <a href="#how-it-works" className="lp-link-btn lp-link-btn-lg">
                {d.heroCtaSecondary}
              </a>
            </div>
          </div>

          <div className="lp-hero-mockup">
            <div className="lp-mockup">
              <div className="lp-mockup-header">
                <span className="badge">{d.mockupBadge}</span>
                <strong>{d.mockupTitle}</strong>
              </div>

              <div className="lp-mockup-stats">
                <div className="stat">
                  <strong>{d.mockupStat1Value}</strong>
                  <span>{d.mockupStat1Label}</span>
                </div>
                <div className="stat">
                  <strong>{d.mockupStat2Value}</strong>
                  <span>{d.mockupStat2Label}</span>
                </div>
                <div className="stat">
                  <strong>{d.mockupStat3Value}</strong>
                  <span>{d.mockupStat3Label}</span>
                </div>
              </div>

              <div className="lp-prospect-list">
                <ProspectCardMockup
                  company="Clifton Web Design"
                  location="London, UK"
                  employees="11–30"
                  industry="Web Design"
                  score={91}
                />
                <ProspectCardMockup
                  company="Harborview Creative"
                  location="Austin, US"
                  employees="5–15"
                  industry="Digital Marketing"
                  score={78}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="lp-social-proof">
          <p>{d.socialProof}</p>
        </section>

        <section className="lp-section">
          <h2 className="lp-section-title">{d.problemsTitle}</h2>

          <div className="lp-grid-auto">
            {d.problems.map((p, i) => (
              <div className="card lp-card" key={p.title}>
                <Icon path={problemIcons[i]} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="lp-section">
          <h2 className="lp-section-title">{d.solutionsTitle}</h2>

          <div className="lp-grid-3">
            {d.solutions.map((s, i) => (
              <div className="card lp-card" key={s.title}>
                <Icon path={solutionIcons[i]} />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="lp-section lp-workflow-section">
          <h2 className="lp-section-title">{d.workflowTitle}</h2>

          <div className="lp-grid-4">
            {d.workflowSteps.map((step, i) => (
              <div className="lp-step" key={step.title}>
                <span className="lp-step-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="lp-step-icon">
                  <Icon path={workflowIcons[i]} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section lp-preview-section">
          <h2 className="lp-section-title">{d.previewTitle}</h2>

          <p className="lp-preview-subtitle">{d.previewSubtitle}</p>

          <div className="lp-preview-mockup">
            <div className="lp-detail-mockup">
              <div className="lp-detail-header">
                <div>
                  <span className="badge">{d.previewDetailBadge}</span>
                  <h3>Clifton Web Design</h3>
                </div>
                <ScoreBadge score={91} />
              </div>

              <div className="lp-detail-grid">
                <div className="lp-detail-field">
                  <span>{d.previewFieldLocation}</span>
                  <strong>London, United Kingdom</strong>
                </div>
                <div className="lp-detail-field">
                  <span>{d.previewFieldEmployees}</span>
                  <strong>11–30</strong>
                </div>
                <div className="lp-detail-field">
                  <span>{d.previewFieldIndustry}</span>
                  <strong>Web Design</strong>
                </div>
                <div className="lp-detail-field">
                  <span>{d.previewFieldDecisionMaker}</span>
                  <strong>Founder / Managing Director</strong>
                </div>
                <div className="lp-detail-field lp-detail-field-wide">
                  <span>{d.previewFieldWebsite}</span>
                  <strong>cliftonwebdesign.co.uk</strong>
                </div>
              </div>

              <div className="lp-detail-actions">
                <span className="lp-detail-action">{d.previewActionView}</span>
                <span className="lp-detail-action">{d.previewActionContact}</span>
                <span className="lp-detail-action lp-detail-action-primary">
                  {d.previewActionGenerate}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <div className="lp-agent-header">
            <h2 className="lp-section-title">{d.agentTitle}</h2>
            <p className="lp-preview-subtitle">{d.agentSubtitle}</p>
          </div>

          <div className="lp-grid-5">
            {d.agentFeatures.map((f, i) => (
              <div className="lp-agent-feature" key={f}>
                <Icon path={agentIcons[i]} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section lp-why-section">
          <h2 className="lp-section-title">{d.whyTitle}</h2>

          <div className="lp-grid-3">
            {d.why.map((w, i) => (
              <div className="card lp-card" key={w.title}>
                <Icon path={whyIcons[i]} />
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="lp-section">
          <h2 className="lp-section-title">{d.pricingTitle}</h2>

          <div className="lp-grid-3 lp-pricing-grid">
            {d.pricingPlans.map((plan, i) => (
              <div className="card lp-card lp-pricing-card" key={plan.name}>
                <h3>{plan.name}</h3>
                <p className="lp-pricing-tagline">{plan.tagline}</p>
                <div className="lp-pricing-price">{plan.price}</div>

                <ul className="lp-pricing-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <Icon path={icons.check} />
                      {f}
                    </li>
                  ))}
                </ul>

                {i === 0 ? (
                  <Link
                    href={`/${locale}/register`}
                    className="lp-link-btn lp-pricing-cta"
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <span className="lp-link-btn lp-pricing-cta lp-pricing-cta-disabled">
                    {plan.cta}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="lp-section lp-faq-section">
          <h2 className="lp-section-title">{d.faqTitle}</h2>

          <FaqAccordion faqs={d.faq} />
        </section>

        <section className="lp-cta">
          <h2 className="lp-section-title">{d.ctaTitle}</h2>

          <p className="lp-cta-subtitle">{d.ctaSubtitle}</p>

          <Link href={`/${locale}/register`} className="btn lp-btn-lg">
            {d.ctaButton}
          </Link>
        </section>

        <footer className="lp-footer">
          <span className="lp-brand">Zappivot</span>
          <p>{d.footerTagline}</p>
          <p className="lp-footer-links">
            <Link href={`/${locale}/privacy`}>{d.footerPrivacy}</Link>
            <span> · </span>
            <Link href={`/${locale}/terms`}>{d.footerTerms}</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
