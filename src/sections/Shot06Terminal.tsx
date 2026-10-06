import { TERMINAL } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { Disclaimer } from '../ui/Disclaimer'
import { ImageSlotFrame } from '../ui/Placeholder'

export function Shot06Terminal() {
  return (
    <Shot id="06" frame="bottom-left" label="The real problem" scrim="left">
      <p className="terminal__sample mono mono--sm" role="note">
        {TERMINAL.wallLabel}
      </p>
      <div className="terminal">
        <div>
          <p className="shot__kicker mono">{TERMINAL.kicker}</p>
          <h2 className="display display--lg shot__headline shot__headline--wide">
            <Accent text={TERMINAL.headline} />
          </h2>
          <p className="lede shot__copy">{TERMINAL.body}</p>
          <ul className="terminal__lines mono" aria-label="Signs this is for you">
            {TERMINAL.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <Disclaimer />
        </div>
        <figure className="terminal__photo">
          <ImageSlotFrame slot="wallstreet" />
          <figcaption className="mono mono--sm gold">{TERMINAL.photoCaption}</figcaption>
        </figure>
      </div>
    </Shot>
  )
}
