import { useEffect, useRef } from 'react'
import { TAPE } from '../content/copy'
import { ARCHITECT_FACTS, FIGHTER_FACTS } from '../content/facts'
import { Shot } from '../ui/Shot'
import { FactValue } from '../ui/VerifyTag'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { useSettings } from '../store/useSettings'

/** Broadcast lower-third: rows wipe in with a gold scanline (0.5s power3.inOut, stagger 0.07). */
export function Shot02Tape() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useSettings((s) => s.reducedMotion)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rows = el.querySelectorAll<HTMLElement>('.tape__row')
    const cells = el.querySelectorAll<HTMLElement>('.tape__cell, .tape__label')
    const scans = el.querySelectorAll<HTMLElement>('.tape__scan')
    const head = el.querySelector('.tape__head')
    if (reduced) {
      gsap.set(cells, { opacity: 1 })
      return
    }
    gsap.set(cells, { opacity: 0 })
    gsap.set(head, { scaleX: 0, transformOrigin: 'center' })
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el.closest('section'), start: 'top 60%', toggleActions: 'play none none none' },
    })
    tl.to(head, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' })
    rows.forEach((row, i) => {
      const at = 0.2 + i * 0.07
      const rowCells = row.querySelectorAll('.tape__cell, .tape__label')
      tl.fromTo(scans[i], { xPercent: -100, opacity: 1 }, { xPercent: 100, opacity: 0.9, duration: 0.5, ease: 'power3.inOut' }, at)
      tl.to(rowCells, { opacity: 1, duration: 0.25, ease: 'power2.out' }, at + 0.22)
      tl.set(scans[i], { opacity: 0 }, at + 0.5)
    })
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      ScrollTrigger.refresh()
    }
  }, [reduced])

  return (
    <Shot id="02" frame="center" label="Tale of the tape">
      <div className="tape" ref={ref}>
        <div className="tape__head">
          <p className="tape__col-title mono">{TAPE.left}</p>
          <h2 className="display display--sm">{TAPE.kicker}</h2>
          <p className="tape__col-title tape__col-title--r mono">{TAPE.right}</p>
        </div>
        <ul className="tape__rows" aria-label="Fighter versus architect">
          {FIGHTER_FACTS.map((f, i) => {
            const a = ARCHITECT_FACTS[i]
            return (
              <li className="tape__row" key={i}>
                <span className="tape__cell">
                  <span className="sr-only">{TAPE.left}: </span>
                  <FactValue fact={f} />
                </span>
                <span className="tape__label mono mono--sm" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="tape__cell tape__cell--r">
                  <span className="sr-only">{TAPE.right}: </span>
                  <FactValue fact={a} />
                </span>
                <span className="tape__scan" aria-hidden="true" />
              </li>
            )
          })}
        </ul>
      </div>
    </Shot>
  )
}
