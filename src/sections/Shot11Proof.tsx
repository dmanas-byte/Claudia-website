import { PROOF } from '../content/copy'
import { PROOF_IMAGES } from '../content/placeholders'
import { TESTIMONIALS } from '../content/testimonials'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'

/** Real testimonials from the owner's site. Set VITE_SHOW_TESTIMONIALS=false to hide. */
const SHOW = import.meta.env.VITE_SHOW_TESTIMONIALS !== 'false'

export function Shot11Proof() {
  if (!SHOW) {
    // keep the shot in the scroll map so the camera path stays aligned; zero height
    return <section id="proof" data-shot="11" className="shot shot--11" style={{ minHeight: 0, height: 0 }} aria-hidden="true" />
  }
  return (
    <Shot id="11" frame="center-left" label="Testimonials and community proof" scrim="full">
      <div className="proof">
        <div>
          <p className="shot__kicker mono">{PROOF.kicker}</p>
          <h2 className="display display--md shot__headline">
            <Accent text={PROOF.headline} />
          </h2>
        </div>
        <ul className="proof__grid">
          {TESTIMONIALS.map((t) => (
            <li className="quote" key={t.name}>
              <blockquote className="quote__text">“{t.quote}”</blockquote>
              <footer className="quote__by">
                <span className="quote__initials display" aria-hidden="true">
                  {t.initials}
                </span>
                <span>
                  <cite className="quote__name">{t.name}</cite>
                  <span className="quote__role mono mono--sm">{t.role}</span>
                </span>
              </footer>
            </li>
          ))}
        </ul>
        <div className="proof__community">
          <p className="shot__kicker mono">{PROOF.communityKicker}</p>
          <h3 className="display display--sm">{PROOF.communityHeadline}</h3>
          <ul className="proof__strip" aria-label="Community posts">
            {PROOF_IMAGES.map((im) => (
              <li className="proof__shot" key={im.src} style={{ aspectRatio: `${im.w} / ${im.h}` }}>
                <img src={im.src} alt={im.alt} loading="lazy" decoding="async" width={im.w} height={im.h} />
              </li>
            ))}
          </ul>
          <p className="mono mono--sm ash">{PROOF.communityNote}</p>
        </div>
      </div>
    </Shot>
  )
}
