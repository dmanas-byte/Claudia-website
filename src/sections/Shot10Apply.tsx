import { APPLY, INSIDE } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { Disclaimer } from '../ui/Disclaimer'
import { ApplyForm } from '../ui/forms/ApplyForm'

export function Shot10Apply() {
  return (
    <Shot id="10" frame="center-left" label="Apply to work with Claudia" className="shot--form" scrim="full">
      <div className="apply">
        <div className="apply__top">
          <div>
            <p className="shot__kicker mono">{APPLY.kicker}</p>
            <h2 className="display display--lg shot__headline shot__headline--wide">
              <Accent text={APPLY.headline} />
            </h2>
            <p className="lede shot__copy">{APPLY.body}</p>
            <p className="apply__urgency display display--sm gold">{APPLY.urgency}</p>
          </div>
          <div className="apply__form" id="apply-form">
            <h3 className="apply__form-title">{APPLY.formTitle}</h3>
            <ApplyForm />
          </div>
        </div>
        <div className="apply__inside">
          <h3 className="rule mono">{APPLY.insideTitle}</h3>
          <ol className="inside">
            {INSIDE.map((it) => (
              <li className="inside__item" key={it.n}>
                <span className="inside__n mono mono--sm gold">{it.n}</span>
                <span className="inside__t">{it.t}</span>
                <span className="inside__d">{it.d}</span>
              </li>
            ))}
          </ol>
        </div>
        <Disclaimer />
      </div>
    </Shot>
  )
}
