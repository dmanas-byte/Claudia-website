import { TERMINAL } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { Disclaimer } from '../ui/Disclaimer'

export function Shot06Terminal() {
  return (
    <Shot id="06" frame="bottom-left" label="The terminal — real portfolio training">
      <p className="terminal__sample mono mono--sm" role="note">
        {TERMINAL.wallLabel}
      </p>
      <p className="shot__kicker mono">{TERMINAL.kicker}</p>
      <h2 className="display display--lg shot__headline shot__headline--wide">
        <Accent text={TERMINAL.headline} />
      </h2>
      <ul className="terminal__lines mono" aria-label="What real portfolio training means">
        {TERMINAL.lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <Disclaimer />
    </Shot>
  )
}
