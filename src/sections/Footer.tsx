import { BRAND, DISCLAIMER_LONG, FOOTER } from '../content/copy'
import { SISTER_SITE, SOCIALS } from '../content/links'
import { PLACEHOLDER_YEAR } from '../content/placeholders'
import { useSettings } from '../store/useSettings'

export function Footer() {
  const reduced = useSettings((s) => s.reducedMotion)
  const setReduced = useSettings((s) => s.setReducedMotion)
  const year = new Date().getFullYear()
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__inner">
        <div className="footer__cols">
          <div className="footer__col">
            <p className="display display--sm">{BRAND.wordmark}</p>
            <p className="ash" style={{ maxWidth: '36ch' }}>
              {BRAND.description}
            </p>
          </div>
          <div className="footer__col">
            <h2 className="mono">{FOOTER.socials}</h2>
            {SOCIALS.map((s) => (
              <a className="footer__link" href={s.href} key={s.label} target="_blank" rel="noopener noreferrer">
                {s.label} <small className="mono mono--sm">{s.handle}</small>
              </a>
            ))}
          </div>
          <div className="footer__col">
            <h2 className="mono">{FOOTER.legal}</h2>
            <a className="footer__link" href="/privacy" data-route>
              {FOOTER.privacy}
            </a>
            <a className="footer__link" href="/terms" data-route>
              {FOOTER.terms}
            </a>
            <a className="footer__link" href={SISTER_SITE.href} target="_blank" rel="noopener noreferrer">
              {FOOTER.sister}
            </a>
          </div>
          <div className="footer__col">
            <h2 className="mono">Settings</h2>
            <button type="button" className="toggle" aria-pressed={reduced} onClick={() => setReduced(!reduced)}>
              <span className="toggle__track" aria-hidden="true" />
              <span>{FOOTER.reduceMotion}</span>
            </button>
          </div>
        </div>
        {/* [OWNER'S COUNSEL TO REVIEW WORDING] — keep visible */}
        <div className="footer__legal" id="disclaimer">
          {DISCLAIMER_LONG.map((d) => (
            <p key={d}>{d}</p>
          ))}
        </div>
        <div className="footer__bottom mono mono--sm">
          <span>
            {FOOTER.copyright} {year || PLACEHOLDER_YEAR}
          </span>
          <span>{BRAND.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
