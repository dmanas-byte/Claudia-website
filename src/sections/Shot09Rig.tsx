import { useEffect, useRef, useState } from 'react'
import { CTA, RIG } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { useScroll } from '../store/useScroll'
import { scrollToAnchor } from '../lib/scroll'

/**
 * SHOT 09 — The Rig. "Is this for me?" Four personas; the 30 arena lights fire
 * in sequence (60 ms steps) as the shot scrolls, one row per persona.
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
  const personaOn = Math.min(4, Math.floor(lit / 7.5) + (lit > 0 ? 1 : 0))

  return (
    <Shot id="09" frame="center-left" label="Is this for me?" scrim="full">
      <div className="rig">
        <div className="rig__intro">
          <p className="shot__kicker mono">{RIG.kicker}</p>
          <div className="rig__grid" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <span className={`rig__cell ${i < lit ? 'is-lit' : ''}`} key={i} />
            ))}
          </div>
          <p className="rig__count mono mono--sm" aria-live="off">
            {RIG.count} {String(lit).padStart(2, '0')} / 30
          </p>
          <h2 className="display display--md shot__headline shot__headline--wide">
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
        <ul className="rig__personas" aria-label="Who this is for">
          {RIG.personas.map((p, i) => (
            <li className={`persona ${i < personaOn ? 'is-on' : ''}`} key={p.t}>
              <span className="persona__n mono mono--sm">{String(i + 1).padStart(2, '0')}</span>
              <span className="persona__t display">{p.t}</span>
              <span className="persona__d">{p.d}</span>
            </li>
          ))}
        </ul>
      </div>
    </Shot>
  )
}
