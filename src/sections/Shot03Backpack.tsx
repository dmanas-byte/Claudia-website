import { BACKPACK } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'

export function Shot03Backpack() {
  return (
    <Shot id="03" frame="center-left" label="The backpack">
      <p className="shot__kicker mono">{BACKPACK.kicker} — The backpack</p>
      <h2 className="display display--md shot__headline backpack__headline">
        <Accent text={BACKPACK.headline} />
      </h2>
    </Shot>
  )
}
