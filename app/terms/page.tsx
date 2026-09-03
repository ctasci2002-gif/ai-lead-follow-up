import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Zappivot",
  description: "The terms that govern your use of Zappivot.",
};

export default function TermsPage() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="topbar">
          <div>
            <span className="badge">Zappivot</span>
            <h1 className="title" style={{ fontSize: 34 }}>
              Terms of Service
            </h1>
            <p className="subtitle">Last updated: September 3, 2026</p>
          </div>
        </div>

        <section className="card legal-content">
          <p>
            These terms govern your use of Zappivot at{" "}
            <Link href="/">zappivot.com</Link>. By creating an account, you
            agree to them.
          </p>

          <h2>1. The service</h2>
          <p>
            Zappivot helps agencies discover prospect companies, research
            decision-makers, and draft personalized outreach using AI. AI
            outputs (company research, scores, draft emails) are generated
            from publicly available sources and the criteria you provide —
            they can be incomplete or inaccurate, and you&apos;re responsible
            for reviewing anything before you act on it or send it.
          </p>

          <h2>2. Your account</h2>
          <p>
            You&apos;re responsible for keeping your login credentials
            secure and for all activity under your account. You must provide
            an accurate email address.
          </p>

          <h2>3. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              Use Zappivot to send unsolicited, deceptive, or unlawful
              messages, or otherwise violate applicable anti-spam laws.
            </li>
            <li>
              Attempt to circumvent the daily usage limits or the
              human-approval step required before any outreach email is
              sent.
            </li>
            <li>
              Use the service to collect or process data on individuals in a
              way that violates their legal rights.
            </li>
            <li>
              Misuse, disrupt, or attempt unauthorized access to Zappivot or
              its underlying infrastructure.
            </li>
          </ul>

          <h2>4. No automatic sending</h2>
          <p>
            Zappivot never sends an outreach email without your explicit,
            per-message approval. You are solely responsible for the content
            and recipients of any email you approve and send.
          </p>

          <h2>5. Plans and limits</h2>
          <p>
            Zappivot currently offers a Free plan with daily usage limits.
            Paid plans are not yet available; pricing shown on the site is
            provisional and may change before launch.
          </p>

          <h2>6. Disclaimer and limitation of liability</h2>
          <p>
            Zappivot is provided &quot;as is&quot;, without warranties of any
            kind. To the maximum extent permitted by law, we are not liable
            for any indirect, incidental, or consequential damages arising
            from your use of the service, including outcomes of outreach you
            choose to send.
          </p>

          <h2>7. Termination</h2>
          <p>
            You may stop using Zappivot and request account deletion at any
            time. We may suspend or terminate accounts that violate these
            terms.
          </p>

          <h2>8. Changes</h2>
          <p>
            We may update these terms as the product evolves. Continued use
            of Zappivot after a change means you accept the updated terms.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:ctasci2002@gmail.com">ctasci2002@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
