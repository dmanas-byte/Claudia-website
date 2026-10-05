import { PROOF } from '../content/copy'
import { PLACEHOLDER_TESTIMONIAL, TESTIMONIAL_SLOTS } from '../content/placeholders'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'

const SHOW = import.meta.env.VITE_SHOW_TESTIMONIALS === 'true'

/** Gated behind VITE_SHOW_TESTIMONIALS. Never a sample testimonial. */
export function Shot11Proof() {
  if (!SHOW) {
    // keep the shot in the scroll map so the camera path stays aligned; zero height
    return <section id="proof" data-shot="11" className="shot shot--11" style={{ minHeight: 0, height: 0 }} aria-hidden="true" />
  }
  return (
    <Shot id="11" frame="center-left" label="Proof wall">
      <div className="proof">
        <p className="shot__kicker mono">{PROOF.kicker}</p>
        <h2 className="display display--md shot__headline">
          <Accent text={PROOF.headline} />
        </h2>
        <ul className="proof__grid">
          {Array.from({ length: TESTIMONIAL_SLOTS }, (_, i) => (
            <li className="ph proof__card" key={i}>
              <p className="ph__caption mono mono--sm">
                <strong>Slot {i + 1}</strong>
                {PLACEHOLDER_TESTIMONIAL}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Shot>
  )
}
