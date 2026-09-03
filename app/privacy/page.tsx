import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Zappivot",
  description: "How Zappivot collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="topbar">
          <div>
            <span className="badge">Zappivot</span>
            <h1 className="title" style={{ fontSize: 34 }}>
              Privacy Policy
            </h1>
            <p className="subtitle">Last updated: September 3, 2026</p>
          </div>
        </div>

        <section className="card legal-content">
          <p>
            Zappivot (&quot;we&quot;, &quot;us&quot;) provides an AI-powered
            prospecting and outreach platform for agencies at{" "}
            <Link href="/">zappivot.com</Link>. This page explains what data
            we collect, why, and how it&apos;s handled.
          </p>

          <h2>1. Information we collect</h2>
          <ul>
            <li>
              <strong>Account information:</strong> your email address, and
              if you sign in with Google, the name and profile details Google
              shares with us for authentication.
            </li>
            <li>
              <strong>Content you provide:</strong> lead and prospect search
              criteria (industry, location, company size), and any leads or
              notes you add manually.
            </li>
            <li>
              <strong>Data we generate for you:</strong> AI-produced company
              research, qualification scores, and draft outreach messages,
              built from public web sources and the inputs above.
            </li>
          </ul>

          <h2>2. How we use your information</h2>
          <p>
            We use your data solely to operate Zappivot for you: running
            searches, generating AI analysis and outreach drafts, sending the
            emails you explicitly approve, and keeping your account and
            dashboard working. We do not sell your data.
          </p>

          <h2>3. Third-party services we rely on</h2>
          <p>Zappivot is built on a small set of infrastructure providers, each processing data only as needed to power the corresponding feature:</p>
          <ul>
            <li>
              <strong>Supabase</strong> — authentication and database storage
              for your account, leads, and prospects.
            </li>
            <li>
              <strong>Anthropic (Claude)</strong> — AI analysis, scoring, and
              outreach message generation.
            </li>
            <li>
              <strong>Tavily</strong> — web search used by the Prospect
              Finder.
            </li>
            <li>
              <strong>Resend</strong> — delivery of outreach emails you
              approve and account-related notifications.
            </li>
            <li>
              <strong>Vercel</strong> — application hosting.
            </li>
          </ul>

          <h2>4. Outreach and third-party contacts</h2>
          <p>
            When you use the AI Marketing Agent, Zappivot only sends an email
            after you personally review and approve it. We never send
            outreach automatically. Recipient contact details are only ever
            ones found verifiably in public search results — Zappivot does
            not guess or fabricate an email address.
          </p>

          <h2>5. Data retention and deletion</h2>
          <p>
            We keep your account data for as long as your account is active.
            You can request deletion of your account and associated data at
            any time by contacting us at the email below.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Zappivot uses a session cookie strictly to keep you signed in.
            We do not use advertising or tracking cookies.
          </p>

          <h2>7. Your rights</h2>
          <p>
            You can access, correct, or delete your data at any time from
            within the app, or by contacting us directly.
          </p>

          <h2>8. Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href="mailto:ctasci2002@gmail.com">ctasci2002@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
