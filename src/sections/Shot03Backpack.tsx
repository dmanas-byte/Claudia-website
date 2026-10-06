import { useEffect, useRef } from 'react'
import { BACKPACK } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { useScroll } from '../store/useScroll'

/** The story steps in paragraph by paragraph as the backpack pours into the skyline. */
export function Shot03Backpack() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = -1
    const unsub = useScroll.subscribe((s) => {
      let step = 0
      if (s.shot > 2) step = 3
      else if (s.shot === 2) step = Math.min(3, Math.floor(s.shotProgress * 3.6))
      if (step !== last) {
        last = step
        el.dataset.step = String(step)
      }
    })
    return unsub
  }, [])
  return (
    <Shot id="03" frame="center-left" label="The backpack — her story" scrim="left">
      <div className="backpack" ref={ref} data-step="0">
        <p className="shot__kicker mono">{BACKPACK.kicker}</p>
        <h2 className="display display--md shot__headline backpack__headline">
          <Accent text={BACKPACK.headline} />
        </h2>
        <div className="backpack__story">
          {BACKPACK.story.map((p, i) => (
            <p className="lede backpack__para" key={i} data-para={i + 1}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </Shot>
  )
}
