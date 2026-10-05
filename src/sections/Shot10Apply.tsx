import { APPLY } from '../content/copy'
import { PLACEHOLDER_PRICING } from '../content/placeholders'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { Token } from '../ui/Placeholder'
import { Disclaimer } from '../ui/Disclaimer'
import { ApplyForm } from '../ui/forms/ApplyForm'

export function Shot10Apply() {
  return (
    <Shot id="10" frame="center-left" label="Apply to the program" className="shot--form">
      <div className="apply">
        <div className="apply__top">
          <div>
            <p className="shot__kicker mono">{APPLY.kicker}</p>
            <h2 className="display display--lg shot__headline">
              <Accent text={APPLY.headline} />
            </h2>
            <p className="lede shot__copy">{APPLY.body}</p>
          </div>
          <div className="apply__price" aria-label="Membership price">
            <span className="mono ash">{APPLY.priceLabel}</span>
            <Token>{PLACEHOLDER_PRICING}</Token>
          </div>
        </div>
        <div className="apply__cols">
          <div className="apply__col">
            <h3 className="mono gold">{APPLY.forTitle}</h3>
            <ul>
              {APPLY.for.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
          <div className="apply__col apply__col--not">
            <h3 className="mono ash">{APPLY.notTitle}</h3>
            <ul>
              {APPLY.not.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="apply__form">
          <h3 className="mono gold">{APPLY.submit}</h3>
          <ApplyForm />
        </div>
        <Disclaimer />
      </div>
    </Shot>
  )
}
