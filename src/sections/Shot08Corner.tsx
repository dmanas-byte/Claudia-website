import { useEffect, useRef } from 'react'
import { CORNER } from '../content/copy'
import { PLACEHOLDER_CALL_SCHEDULE } from '../content/placeholders'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { Token } from '../ui/Placeholder'
import { useScroll } from '../store/useScroll'

/** The framework: LIBERDADE, nine principles that light up one by one with the seats. */
export function Shot08Corner() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = -1
    const unsub = useScroll.subscribe((s) => {
      let n = 0
      if (s.shot > 7) n = 9
      else if (s.shot === 7) n = Math.min(9, Math.floor(s.shotProgress * 11))
      if (n !== last) {
        last = n
        el.dataset.lit = String(n)
      }
    })
    return unsub
  }, [])

  return (
    <Shot id="08" frame="center-left" label="The framework — Liberdade" scrim="full">
      <div className="corner" ref={ref} data-lit="0">
        <div className="corner__intro">
          <p className="shot__kicker mono">{CORNER.kicker}</p>
          <h2 className="display display--md shot__headline">
            <Accent text={CORNER.headline} />
          </h2>
          <p className="lede corner__body">{CORNER.body}</p>
          <p className="corner__schedule mono">
            {CORNER.schedule} <Token>{PLACEHOLDER_CALL_SCHEDULE}</Token>
          </p>
        </div>
        <ol className="corner__grid" aria-label={`${CORNER.word} — nine principles`}>
          {CORNER.principles.map((p, i) => (
            <li className="principle" key={p.pt} data-i={i + 1}>
              <span className="principle__letter display" aria-hidden="true">
                {CORNER.word[i]}
              </span>
              <span className="principle__pt display">{p.pt}</span>
              <span className="principle__en mono mono--sm">{p.en}</span>
              <span className="principle__d">{p.d}</span>
            </li>
          ))}
        </ol>
      </div>
    </Shot>
  )
}
