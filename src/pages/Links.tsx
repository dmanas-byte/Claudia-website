import { LINKS } from '../content/copy'
import { Logo } from '../ui/Logo'
import { Token } from '../ui/Placeholder'
import { SOCIALS } from '../content/links'
import './pages.css'

/** Link-in-bio page, ported from the live site's /links. */
export function LinksPage() {
  return (
    <div className="page">
      <div className="page__bg" aria-hidden="true" />
      <main id="main" className="page__main" style={{ paddingTop: 'clamp(40px, 10vh, 120px)' }}>
        <section className="links" aria-label="Links">
          <Logo size={56} />
          <h1 className="display display--sm">{LINKS.name}</h1>
          <p className="mono mono--sm gold">{LINKS.creds}</p>
          <p className="accent" style={{ fontSize: '1.4rem' }}>
            {LINKS.tagline}
          </p>
          <ul className="links__list">
            {LINKS.items.map((it) =>
              it.href ? (
                <li key={it.t}>
                  <a className="links__item" href={it.href} data-route={it.href.startsWith('/') ? '' : undefined} target={it.href.startsWith('http') ? '_blank' : undefined} rel={it.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    <span className="links__t">{it.t}</span>
                    <span className="links__d">{it.d}</span>
                  </a>
                </li>
              ) : (
                <li key={it.t} className="links__item links__item--ph">
                  <span className="links__t">{it.t}</span>
                  <span className="links__d">{it.d}</span>
                  <Token>{it.placeholder ?? 'LINK — OWNER TO SUPPLY'}</Token>
                </li>
              ),
            )}
          </ul>
          <ul className="creds mono mono--sm" style={{ justifyContent: 'center', marginTop: 20 }} aria-label="Social profiles">
            {SOCIALS.slice(0, 3).map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="accent" style={{ marginTop: 24 }}>
            {LINKS.quote}
          </p>
        </section>
      </main>
    </div>
  )
}
