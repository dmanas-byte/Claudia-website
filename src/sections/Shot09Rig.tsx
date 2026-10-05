import { useEffect, useRef, useState } from 'react'
import { CTA, RIG } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { useScroll } from '../store/useScroll'
import { scrollToAnchor } from '../lib/scroll'

/**
 * SHOT 09 — The Rig. 30 arena lights fire in sequence (60 ms steps) as the
 * shot scrolls: the stadium powers up for the application.
 */
export function Shot09Rig() {
  const [lit, setLit] = useState(0)
  const last = useRef(0)
  useEffect(() => {
    const unsub = useScroll.subscribe((s) => {
      let n = 0
      if (s.shot > 8) n = 30
      else if (s.shot === 8) n = Math.min(30, Math.floor(s.shotProgress * 1.25 * 30))
      if (n !== last.current) {
        last.current = n
        setLit(n)
      }
    })
    return unsub
  }, [])

  return (
    <Shot id="09" frame="bottom-left" label="Applications open">
      <div className="rig">
        <p className="shot__kicker mono">{RIG.kicker}</p>
        <div className="rig__grid" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <span className={`rig__cell ${i < lit ? 'is-lit' : ''}`} key={i} />
          ))}
        </div>
        <p className="rig__count mono mono--sm" aria-live="off">
          {RIG.count} {String(lit).padStart(2, '0')} / 30
        </p>
        <h2 className="display display--lg shot__headline">
          <Accent text={RIG.headline} />
        </h2>
        <p className="lede shot__copy">{RIG.body}</p>
        <div className="shot__ctas">
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
        </div>
      </div>
    </Shot>
  )
}
