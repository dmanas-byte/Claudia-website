import { CTA, FINALE } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { scrollToAnchor } from '../lib/scroll'

export function Shot12Finale() {
  return (
    <Shot id="12" frame="center" label="Your walkout starts here" scrim="center">
      <h2 className="display display--xl shot__headline finale__headline" style={{ justifySelf: 'center' }}>
        <Accent text={FINALE.headline} />
      </h2>
      <p className="finale__quote accent">{FINALE.quote}</p>
      <div className="shot__ctas" style={{ justifyContent: 'center' }}>
        <a
          href="#apply"
          className="btn btn--gold"
          onClick={(e) => {
            e.preventDefault()
            scrollToAnchor('apply')
          }}
        >
          {CTA.apply}
        </a>
        <a
          href="#program"
          className="btn btn--ghost"
          onClick={(e) => {
            e.preventDefault()
            scrollToAnchor('program')
          }}
        >
          {CTA.program}
        </a>
      </div>
    </Shot>
  )
}
