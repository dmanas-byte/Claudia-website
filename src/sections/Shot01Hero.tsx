import { useEffect, useRef } from 'react'
import { CTA, HERO } from '../content/copy'
import { Shot } from '../ui/Shot'
import { RevealLines } from '../ui/Accent'
import { useSettings } from '../store/useSettings'
import { gsap, scrollToAnchor } from '../lib/scroll'
import './sections.css'

export function Shot01Hero() {
  const introDone = useSettings((s) => s.introDone)
  const preloaderDone = useSettings((s) => s.preloaderDone)
  const reduced = useSettings((s) => s.reducedMotion)
  const ref = useRef<HTMLDivElement>(null)

  // mask reveal after the cold open: translateY 110% → 0, 0.9s expo.out, stagger 0.08
  useEffect(() => {
    const ready = introDone || preloaderDone || reduced
    if (!ready || !ref.current) return
    const lines = ref.current.querySelectorAll('[data-reveal-line]')
    const rest = ref.current.querySelectorAll('[data-reveal]')
    if (reduced) {
      gsap.set([lines, rest], { yPercent: 0, opacity: 1 })
      return
    }
    const tl = gsap.timeline({ delay: 0.05 })
    tl.to(lines, { yPercent: -0, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, startAt: { yPercent: 110 } })
    tl.fromTo(rest, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.06 }, '-=0.45')
    return () => {
      tl.kill()
    }
  }, [introDone, preloaderDone, reduced])

  return (
    <Shot id="01" frame="bottom-left" label="The walkout" scrim="left">
      <div ref={ref} className="hero">
        <p className="shot__kicker mono" data-reveal style={{ opacity: 0 }}>
          {HERO.kicker}
        </p>
        <h1 className="display display--lg shot__headline hero__headline">
          <RevealLines lines={HERO.lines} />
        </h1>
        <p className="lede hero__offer" data-reveal style={{ opacity: 0 }}>
          {HERO.offer}
        </p>
        <ul className="hero__pillars mono mono--sm" data-reveal style={{ opacity: 0 }} aria-label="Program pillars">
          {HERO.pillars.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="shot__ctas" data-reveal style={{ opacity: 0 }}>
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
          <a
            href="#program"
            className="btn btn--ghost"
            onClick={(e) => {
              e.preventDefault()
              scrollToAnchor('program')
            }}
          >
            {CTA.program}
          </a>
        </div>
      </div>
    </Shot>
  )
}
