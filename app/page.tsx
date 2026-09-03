import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zappivot — Find Your Next Best Client",
  description:
    "Zappivot helps agencies discover qualified prospects, find the right decision-makers, and turn research into personalized outreach — in minutes.",
  openGraph: {
    title: "Zappivot — Find Your Next Best Client",
    description:
      "Zappivot helps agencies discover qualified prospects, find the right decision-makers, and turn research into personalized outreach — in minutes.",
    type: "website",
    siteName: "Zappivot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zappivot — Find Your Next Best Client",
    description:
      "Zappivot helps agencies discover qualified prospects, find the right decision-makers, and turn research into personalized outreach — in minutes.",
  },
};

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
  spark:
    "M12 3v4M12 17v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M17 12h4M4.2 19.8 7 17M17 7l2.8-2.8",
  chart: "M4 20V10M10 20V4M16 20v-7M4 20h16",
  check: "M5 12l4 4 10-10",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z",
};

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
          {location} · {employees} employees · {industry}
        </span>
      </div>
      <ScoreBadge score={score} />
    </div>
  );
}

function DashboardMockup({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? "lp-mockup lp-mockup-lg" : "lp-mockup"}>
      <div className="lp-mockup-header">
        <span className="badge">Zappivot</span>
        <strong>Prospect Finder</strong>
      </div>

      <div className="lp-mockup-stats">
        <div className="stat">
          <strong>132</strong>
          <span>Prospects Found</span>
        </div>
        <div className="stat">
          <strong>48</strong>
          <span>Verified Contacts</span>
        </div>
        <div className="stat">
          <strong>12</strong>
          <span>Ready to Send</span>
        </div>
        {large && (
          <div className="stat">
            <strong>91</strong>
            <span>Top Score</span>
          </div>
        )}
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
        {large && (
          <ProspectCardMockup
            company="Northlane Studio"
            location="Toronto, CA"
            employees="15–30"
            industry="SEO"
            score={65}
          />
        )}
      </div>
    </div>
  );
}

function ProspectDetailMockup() {
  return (
    <div className="lp-detail-mockup">
      <div className="lp-detail-header">
        <div>
          <span className="badge">Prospect</span>
          <h3>Clifton Web Design</h3>
        </div>
        <ScoreBadge score={91} />
      </div>

      <div className="lp-detail-grid">
        <div className="lp-detail-field">
          <span>Location</span>
          <strong>London, United Kingdom</strong>
        </div>
        <div className="lp-detail-field">
          <span>Employees</span>
          <strong>11–30</strong>
        </div>
        <div className="lp-detail-field">
          <span>Industry</span>
          <strong>Web Design</strong>
        </div>
        <div className="lp-detail-field">
          <span>Decision Maker</span>
          <strong>Founder / Managing Director</strong>
        </div>
        <div className="lp-detail-field lp-detail-field-wide">
          <span>Website</span>
          <strong>cliftonwebdesign.co.uk</strong>
        </div>
      </div>

      <div className="lp-detail-actions">
        <span className="lp-detail-action">View Prospect</span>
        <span className="lp-detail-action">Find Contact</span>
        <span className="lp-detail-action lp-detail-action-primary">
          Generate Email
        </span>
      </div>
    </div>
  );
}

const problems = [
  {
    icon: icons.search,
    title: "Endless Google searches",
    text: "Hours spent digging through search results just to find companies that might fit.",
  },
  {
    icon: icons.clock,
    title: "Manual prospect research",
    text: "Copying company details from tab to tab instead of actually reaching out.",
  },
  {
    icon: icons.users,
    title: "Finding the wrong contacts",
    text: "Generic inbox addresses instead of the person who actually makes decisions.",
  },
  {
    icon: icons.message,
    title: "Generic cold emails",
    text: "Templates that ignore what the prospect actually does, and it shows.",
  },
  {
    icon: icons.chart,
    title: "Hours wasted switching tools",
    text: "Search, spreadsheet, inbox, CRM — juggling four tools for one outreach.",
  },
];

const solutions = [
  {
    icon: icons.search,
    title: "Prospect Finder",
    text: "Discover agencies that match your ideal customer profile.",
  },
  {
    icon: icons.users,
    title: "Decision Maker Intelligence",
    text: "Identify founders, CEOs, marketing directors and other relevant decision-makers.",
  },
  {
    icon: icons.mail,
    title: "AI Outreach",
    text: "Generate personalized outreach based on each prospect's company, services and online presence.",
  },
];

const workflowSteps = [
  {
    icon: icons.target,
    title: "Define your ICP",
    text: "Tell Zappivot the industry, location and company size you're targeting.",
  },
  {
    icon: icons.search,
    title: "Discover prospects",
    text: "Zappivot searches the web for agencies that match your criteria.",
  },
  {
    icon: icons.users,
    title: "Find decision-makers",
    text: "Founders, CEOs and marketing leads are identified from verified sources.",
  },
  {
    icon: icons.mail,
    title: "Generate personalized outreach",
    text: "A ready-to-send email is drafted from each prospect's real business.",
  },
];

const agentFeatures = [
  { icon: icons.building, title: "Company research" },
  { icon: icons.users, title: "Decision-maker discovery" },
  { icon: icons.globe, title: "Website analysis" },
  { icon: icons.mail, title: "Personalized email generation" },
  { icon: icons.target, title: "Prospect qualification" },
];

const whyZappivot = [
  {
    icon: icons.clock,
    title: "Save Hours",
    text: "Automate repetitive prospect research.",
  },
  {
    icon: icons.target,
    title: "Better Prospects",
    text: "Focus on companies that actually match your ICP.",
  },
  {
    icon: icons.message,
    title: "Better Outreach",
    text: "Send messages based on the prospect's real business.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    tagline: "For testing Zappivot",
    price: "$0",
    features: [
      "Limited prospect searches",
      "Limited AI generations",
      "Basic prospect data",
    ],
  },
  {
    name: "Pro",
    tagline: "For growing agencies",
    price: "Pricing coming soon",
    features: [
      "More prospect searches",
      "AI Marketing Agent",
      "Decision-maker discovery",
      "AI outreach generation",
      "Saved prospects",
    ],
  },
  {
    name: "Agency",
    tagline: "For teams",
    price: "Pricing coming soon",
    features: [
      "Higher limits",
      "Multiple users",
      "Advanced prospecting",
      "Team workflows",
      "Priority support",
    ],
  },
];

const faqs = [
  {
    q: "What is Zappivot?",
    a: "Zappivot is an AI-powered platform that helps agencies find qualified B2B prospects, research the companies and decision-makers behind them, and generate personalized outreach — all in one place.",
  },
  {
    q: "Who is Zappivot for?",
    a: "Zappivot is built for web design, software development, SEO, digital marketing and advertising agencies — typically 5–30 employees — that want a predictable pipeline of new client prospects.",
  },
  {
    q: "How does Zappivot find prospects?",
    a: "You describe your ideal customer profile (industry, location, company size) and Zappivot searches the web for agencies that match, using real, verifiable sources — never fabricated data.",
  },
  {
    q: "Can Zappivot find decision-makers?",
    a: "Yes. When a decision-maker's name, role or contact is publicly available in the sources Zappivot finds, it surfaces that information. Zappivot never guesses or invents a contact that isn't verifiable.",
  },
  {
    q: "Can Zappivot generate outreach emails?",
    a: "Yes. The AI Marketing Agent drafts a personalized cold email for each prospect based on their real company and services. You always review and approve before anything is sent.",
  },
  {
    q: "Do I need another prospecting tool?",
    a: "Zappivot combines prospect discovery, decision-maker research and outreach generation in one workflow, so you don't need to stitch together separate search, research and email tools.",
  },
];

export default function LandingPage() {
  return (
    <main className="lp-page">
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <span className="lp-brand">Zappivot</span>

          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="lp-nav-actions">
            <Link href="/login" className="lp-link-btn">
              Log In
            </Link>
            <Link href="/register" className="btn">
              Start Finding Prospects
            </Link>
          </div>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-hero-text">
          <span className="badge">AI Prospecting for Agencies</span>

          <h1 className="lp-hero-title">Find Your Next Best Client.</h1>

          <p className="lp-hero-subtitle">
            Zappivot helps agencies discover qualified prospects, find the
            right decision-makers, and turn research into personalized
            outreach — in minutes.
          </p>

          <div className="lp-hero-actions">
            <Link href="/register" className="btn lp-btn-lg">
              Start Finding Prospects
            </Link>
            <a href="#how-it-works" className="lp-link-btn lp-link-btn-lg">
              See How It Works
            </a>
          </div>
        </div>

        <div className="lp-hero-mockup">
          <DashboardMockup />
        </div>
      </section>

      <section className="lp-social-proof">
        <p>Built for modern agencies that want a predictable pipeline.</p>
      </section>

      <section className="lp-section">
        <h2 className="lp-section-title">
          Finding clients shouldn&apos;t feel like a full-time job.
        </h2>

        <div className="lp-grid-auto">
          {problems.map((p) => (
            <div className="card lp-card" key={p.title}>
              <Icon path={p.icon} />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="lp-section">
        <h2 className="lp-section-title">
          From prospect search to outreach — in one place.
        </h2>

        <div className="lp-grid-3">
          {solutions.map((s) => (
            <div className="card lp-card" key={s.title}>
              <Icon path={s.icon} />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="lp-section lp-workflow-section">
        <h2 className="lp-section-title">
          Your entire prospecting workflow, automated.
        </h2>

        <div className="lp-grid-4">
          {workflowSteps.map((step, i) => (
            <div className="lp-step" key={step.title}>
              <span className="lp-step-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="lp-step-icon">
                <Icon path={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-preview-section">
        <h2 className="lp-section-title">
          See exactly who you should reach out to next.
        </h2>

        <p className="lp-preview-subtitle">
          Every prospect comes with verified company details, a decision
          maker, and a score — ready for outreach.
        </p>

        <div className="lp-preview-mockup">
          <ProspectDetailMockup />
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-agent-header">
          <h2 className="lp-section-title">
            Your AI marketing assistant for prospecting.
          </h2>
          <p className="lp-preview-subtitle">
            Let AI research prospects, understand what they do, identify
            relevant decision-makers and prepare outreach-ready messaging.
          </p>
        </div>

        <div className="lp-grid-5">
          {agentFeatures.map((f) => (
            <div className="lp-agent-feature" key={f.title}>
              <Icon path={f.icon} />
              <span>{f.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-why-section">
        <h2 className="lp-section-title">Less research. More conversations.</h2>

        <div className="lp-grid-3">
          {whyZappivot.map((w) => (
            <div className="card lp-card" key={w.title}>
              <Icon path={w.icon} />
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="lp-section">
        <h2 className="lp-section-title">Simple pricing, built to grow with you.</h2>

        <div className="lp-grid-3 lp-pricing-grid">
          {pricingPlans.map((plan) => (
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

              <Link href="/register" className="lp-link-btn lp-pricing-cta">
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="lp-section lp-faq-section">
        <h2 className="lp-section-title">Frequently asked questions</h2>

        <div className="lp-faq-list">
          {faqs.map((f) => (
            <div className="lp-faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-cta">
        <h2 className="lp-section-title">Stop searching. Start reaching.</h2>

        <p className="lp-cta-subtitle">
          Build your next pipeline with Zappivot.
        </p>

        <Link href="/register" className="btn lp-btn-lg">
          Start Finding Prospects
        </Link>
      </section>

      <footer className="lp-footer">
        <span className="lp-brand">Zappivot</span>
        <p>AI-powered prospecting and outreach for agencies.</p>
        <p className="lp-footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <span> · </span>
          <Link href="/terms">Terms of Service</Link>
        </p>
      </footer>
    </main>
  );
}
