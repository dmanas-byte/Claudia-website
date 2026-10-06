import { PLACEHOLDER_LEGAL_BODY } from '../content/placeholders'
import { BRAND, DISCLAIMER_LONG } from '../content/copy'
import './legal.css'

const SECTIONS: Record<'privacy' | 'terms', { title: string; headings: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    headings: ['What we collect', 'How we use it', 'Email and text messages', 'Cookies and analytics', 'Your rights', 'Contact'],
  },
  terms: {
    title: 'Terms of Service',
    headings: ['The service', 'Educational purpose, not advice', 'Membership and payment', 'Acceptable use', 'Intellectual property', 'Limitation of liability', 'Contact'],
  },
}

export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const s = SECTIONS[kind]
  return (
    <div className="legal">
      <header className="legal__head">
        <a href="/" className="legal__back mono" data-route>
          ← {BRAND.wordmark}
        </a>
      </header>
      <main id="main" className="legal__main">
        <h1 className="display display--md">{s.title}</h1>
        <p className="mono ash legal__updated">Last updated — [OWNER TO SUPPLY]</p>
        {s.headings.map((h) => (
          <section key={h} className="legal__section">
            <h2 className="display display--sm">{h}</h2>
            <p className="legal__ph mono">{PLACEHOLDER_LEGAL_BODY}</p>
          </section>
        ))}
        <section className="legal__section">
          <h2 className="display display--sm">Disclaimer</h2>
          {DISCLAIMER_LONG.map((d) => (
            <p key={d} className="lede lede--dim">
              {d}
            </p>
          ))}
        </section>
      </main>
    </div>
  )
}
