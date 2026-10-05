import { CTA, FINALE } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { scrollToAnchor } from '../lib/scroll'

export function Shot12Finale() {
  return (
    <Shot id="12" frame="center" label="Your walkout starts here">
      <h2 className="display display--xl shot__headline finale__headline" style={{ justifySelf: 'center' }}>
        <Accent text={FINALE.headline} />
      </h2>
      <div className="shot__ctas" style={{ justifyContent: 'center' }}>
        <a
          href="#challenge"
          className="btn btn--gold"
          onClick={(e) => {
            e.preventDefault()
            scrollToAnchor('challenge')
          }}
        >
          {CTA.challenge}
        </a>
        <a
          href="#apply"
          className="btn btn--ghost"
          onClick={(e) => {
            e.preventDefault()
            scrollToAnchor('apply')
          }}
        >
          {CTA.apply}
        </a>
      </div>
    </Shot>
  )
}
