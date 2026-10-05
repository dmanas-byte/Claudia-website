import { useEffect, useRef, useState } from 'react'
import { CHALLENGE } from '../content/copy'
import { PLACEHOLDER_CHALLENGE_CONTENT } from '../content/placeholders'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { Token } from '../ui/Placeholder'
import { ChallengeForm } from '../ui/forms/ChallengeForm'
import { useScroll } from '../store/useScroll'

/** 30 arena-light cells fire in sequence (60 ms steps) as the shot scrolls. */
export function Shot09Challenge() {
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
    <Shot id="09" frame="bottom-left" label="The free 30-day challenge" className="shot--form">
      <div className="challenge">
        <div>
          <p className="shot__kicker mono">{CHALLENGE.kicker}</p>
          <div className="challenge__grid" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <span className={`challenge__cell ${i < lit ? 'is-lit' : ''}`} key={i} />
            ))}
          </div>
          <p className="challenge__count mono mono--sm" aria-live="off">
            {String(lit).padStart(2, '0')} / 30 lights
          </p>
          <h2 className="display display--lg shot__headline">
            <Accent text={CHALLENGE.headline} />
          </h2>
          <p className="lede shot__copy">
            {CHALLENGE.body} <Token>{PLACEHOLDER_CHALLENGE_CONTENT}</Token>
          </p>
        </div>
        <ChallengeForm />
      </div>
    </Shot>
  )
}
