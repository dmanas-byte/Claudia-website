import { useEffect, useRef } from 'react'
import { ALERT, CTA } from '../content/copy'
import { PLACEHOLDER_ALERT_TIMESTAMP } from '../content/placeholders'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import { gsap, scrollToAnchor } from '../lib/scroll'

/** The alert: slides in from the top with a 40 ms ember flash and a 2-frame shake. */
export function Shot07Alert() {
  const bubble = useRef<HTMLDivElement>(null)
  const reduced = useSettings((s) => s.reducedMotion)
  useEffect(() => {
    const el = bubble.current
    if (!el) return
    if (reduced) {
      gsap.set(el, { clearProps: 'all' })
      return
    }
    let armed = true
    gsap.set(el, { y: -40, opacity: 0 })
    const unsub = useScroll.subscribe((s) => {
      const inBeat = s.shot === 6 && s.shotProgress > 0.25
      if (inBeat && armed) {
        armed = false
        const tl = gsap.timeline()
        tl.to(el, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
        tl.to(document.documentElement, { '--ember-flash': 1, duration: 0.04, ease: 'steps(1)' }, 0.1)
        tl.to(document.documentElement, { '--ember-flash': 0, duration: 0.04 }, 0.14)
        // 2-frame screen shake: the canvas and this shot's own frame (never #main —
        // a transform there would re-parent every fixed frame)
        const shaken = ['.film', '.shot--07 .shot__frame']
        tl.fromTo(shaken, { x: 0 }, { x: 6, duration: 1 / 60, ease: 'steps(1)' }, 0.1)
        tl.to(shaken, { x: -5, duration: 1 / 60, ease: 'steps(1)' })
        tl.to(shaken, { x: 0, duration: 1 / 60, ease: 'steps(1)', clearProps: 'transform' })
      } else if (!inBeat && s.shot !== 6 && !armed) {
        armed = true
        gsap.set(el, { y: -40, opacity: 0 })
      }
    })
    return unsub
  }, [reduced])

  return (
    <Shot id="07" frame="center-left" label="The alert — real-time trade alerts">
      <p className="shot__kicker mono">{ALERT.kicker}</p>
      <div className="alert__bubble" ref={bubble} role="note" aria-label="Sample text alert">
        <span className="alert__from mono mono--sm">{ALERT.sender}</span>
        <span className="alert__msg">{ALERT.message}</span>
        <span className="alert__ts mono mono--sm">{PLACEHOLDER_ALERT_TIMESTAMP}</span>
      </div>
      <h2 className="display display--md shot__headline shot__headline--wide">
        <Accent text={ALERT.headline} />
      </h2>
      <p className="lede shot__copy">{ALERT.body}</p>
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
    </Shot>
  )
}
