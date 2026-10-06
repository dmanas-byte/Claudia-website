import { useEffect, useRef } from 'react'
import { TAPE } from '../content/copy'
import { CAGE_FACTS, NOW_FACTS, type Fact } from '../content/facts'
import { Shot } from '../ui/Shot'
import { FactValue } from '../ui/VerifyTag'
import { gsap } from '../lib/scroll'
import { useSettings } from '../store/useSettings'
import { useScroll } from '../store/useScroll'

function Panel({ title, facts }: { title: string; facts: Fact[] }) {
  return (
    <section className="tape__panel" aria-label={title}>
      <h3 className="tape__panel-title mono">{title}</h3>
      <dl className="tape__rows">
        {facts.map((f) => (
          <div className="tape__row" key={f.label}>
            <dt className="tape__label mono mono--sm">{f.label}</dt>
            <dd className="tape__value">
              <FactValue fact={f} />
            </dd>
            <span className="tape__scan" aria-hidden="true" />
          </div>
        ))}
      </dl>
    </section>
  )
}

/**
 * Tale of the tape, fight-night style: one card, two panels. Left is her
 * fight career, right is what she does now; every row is a label and a value.
 * Rows wipe in with a gold scanline (0.5s power3.inOut, staggered).
 */
export function Shot02Tape() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useSettings((s) => s.reducedMotion)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rows = el.querySelectorAll<HTMLElement>('.tape__row')
    const parts = el.querySelectorAll<HTMLElement>('.tape__label, .tape__value')
    const scans = el.querySelectorAll<HTMLElement>('.tape__scan')
    const head = el.querySelectorAll<HTMLElement>('.tape__head, .tape__panel-title')
    if (reduced) {
      gsap.set([parts, head], { opacity: 1 })
      return
    }
    gsap.set(parts, { opacity: 0 })
    gsap.set(head, { opacity: 0, y: 8 })
    const tl = gsap.timeline({ paused: true })
    tl.to(head, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 })
    // left and right rows come in side by side, top to bottom
    const half = rows.length / 2
    rows.forEach((row, i) => {
      const at = 0.3 + (i % half) * 0.09 + (i >= half ? 0.04 : 0)
      tl.fromTo(scans[i], { xPercent: -100, opacity: 1 }, { xPercent: 100, opacity: 0.85, duration: 0.5, ease: 'power3.inOut' }, at)
      tl.to(row.querySelectorAll('.tape__label, .tape__value'), { opacity: 1, duration: 0.25, ease: 'power2.out' }, at + 0.2)
      tl.set(scans[i], { opacity: 0 }, at + 0.5)
    })
    let played = false
    const check = (shot: number) => {
      if (played) return
      if (shot === 1) {
        played = true
        tl.play(0)
      } else if (shot > 1) {
        played = true
        tl.progress(1)
      }
    }
    check(useScroll.getState().shot)
    const unsub = useScroll.subscribe((s) => check(s.shot))
    return () => {
      unsub()
      tl.kill()
    }
  }, [reduced])

  return (
    <Shot id="02" frame="center-left" label="Tale of the tape">
      <div className="tape" ref={ref}>
        <header className="tape__head">
          <p className="mono gold">{TAPE.kicker}</p>
          <h2 className="display display--sm">{TAPE.name}</h2>
        </header>
        <div className="tape__panels">
          <Panel title={TAPE.left} facts={CAGE_FACTS} />
          <Panel title={TAPE.right} facts={NOW_FACTS} />
        </div>
      </div>
    </Shot>
  )
}
