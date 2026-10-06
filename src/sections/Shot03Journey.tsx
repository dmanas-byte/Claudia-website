import { useEffect, useRef } from 'react'
import { JOURNEY } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { useScroll } from '../store/useScroll'

/** Beat boundaries inside SHOT 03; the scene uses the same ones (cameraPath, Octagon, Towers). */
const BEAT_AT = [0, 0.34, 0.66]

/**
 * SHOT 03 — her journey. Three lines, one per beat: the current line is lit
 * and its paragraph shows; the scene shows the matching picture (the
 * backpack, the cage, the city).
 */
export function Shot03Journey() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = -1
    const apply = (shot: number, p: number) => {
      const beat = shot < 2 ? 1 : shot > 2 ? 3 : p >= BEAT_AT[2] ? 3 : p >= BEAT_AT[1] ? 2 : 1
      if (beat !== last) {
        last = beat
        el.dataset.beat = String(beat)
      }
    }
    const s = useScroll.getState()
    apply(s.shot, s.shotProgress)
    return useScroll.subscribe((st) => apply(st.shot, st.shotProgress))
  }, [])

  return (
    <Shot id="03" frame="center-left" label="Her journey" scrim="left">
      <div className="journey" ref={ref} data-beat="1">
        <p className="shot__kicker mono">{JOURNEY.kicker}</p>
        <h2 className="journey__lines display">
          {JOURNEY.beats.map((b, i) => (
            <span className="journey__line" data-line={i + 1} key={i}>
              <Accent text={b.line} />
            </span>
          ))}
        </h2>
        <div className="journey__story">
          {JOURNEY.beats.map((b, i) => (
            <p className="lede journey__para" data-para={i + 1} key={i}>
              {b.body}
            </p>
          ))}
        </div>
        <ol className="journey__steps mono mono--sm" aria-hidden="true">
          <li data-step="1">The backpack</li>
          <li data-step="2">The fighter</li>
          <li data-step="3">The architect</li>
        </ol>
      </div>
    </Shot>
  )
}
