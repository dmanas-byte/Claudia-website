import { CORNER } from '../content/copy'
import { PLACEHOLDER_CALL_SCHEDULE, PLACEHOLDER_MEMBER_COUNT } from '../content/placeholders'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { Token } from '../ui/Placeholder'

export function Shot08Corner() {
  return (
    <Shot id="08" frame="bottom-left" label="The corner — live weekly calls">
      <p className="shot__kicker mono">{CORNER.kicker}</p>
      <h2 className="display display--lg shot__headline shot__headline--wide">
        <Accent text={CORNER.headline} />
      </h2>
      <p className="lede shot__copy">{CORNER.body}</p>
      <ul className="corner__slots mono">
        <li>
          {CORNER.schedule} <Token>{PLACEHOLDER_CALL_SCHEDULE}</Token>
        </li>
        <li>
          {CORNER.members} <Token>{PLACEHOLDER_MEMBER_COUNT}</Token>
        </li>
      </ul>
    </Shot>
  )
}
