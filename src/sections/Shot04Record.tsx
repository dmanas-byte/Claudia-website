import { useEffect, useRef } from 'react'
import { RECORD } from '../content/copy'
import { POSTERS } from '../content/facts'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { ImageSlotFrame } from '../ui/Placeholder'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import { gsap } from '../lib/scroll'

/**
 * Horizontal timeline: vertical scroll → horizontal translate (scrub 0.8s)
 * on desktop; a native snap-scrolling track on mobile / reduced motion.
 */
export function Shot04Record() {
  const track = useRef<HTMLOListElement>(null)
  const lowPower = useSettings((s) => s.lowPower)
  const reduced = useSettings((s) => s.reducedMotion)
  const native = lowPower || reduced

  useEffect(() => {
    if (native || !track.current) return
    const el = track.current
    const target = { x: 0 }
    const setX = gsap.quickTo(target, 'x', {
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        el.style.transform = `translate3d(${target.x}px,0,0)`
      },
    })
    const unsub = useScroll.subscribe((s) => {
      if (s.shot !== 3 && !(s.shot === 2 && s.shotProgress > 0.9) && !(s.shot === 4 && s.shotProgress < 0.05)) return
      const p = s.shot === 3 ? s.shotProgress : s.shot < 3 ? 0 : 1
      const overflow = Math.max(0, el.scrollWidth - el.parentElement!.clientWidth)
      setX(-p * overflow)
    })
    return () => {
      unsub()
      el.style.transform = ''
    }
  }, [native])

  return (
    <Shot id="04" frame="center-left" label="Her story — the record" scrim="full">
      <div className="record">
        <div className="record__head">
          <h2 className="display display--md">
            <Accent text={RECORD.headline} />
          </h2>
          <p className="mono ash">{RECORD.hint}</p>
        </div>
        <ol className="record__track" ref={track} aria-label="Career timeline">
          {POSTERS.map((p) => (
            <li className="poster" key={p.n}>
              <span className="display poster__n" aria-hidden="true">
                {p.n}
              </span>
              <h3 className="display poster__title">{p.title}</h3>
              <p className="poster__date mono" data-verify={p.dateVerified ? 'verified' : 'unverified'}>
                {p.date}
                {!p.dateVerified && <span className="verify">[VERIFY]</span>}
              </p>
              <ImageSlotFrame slot={p.slot} />
              <p className="poster__line">{p.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </Shot>
  )
}
