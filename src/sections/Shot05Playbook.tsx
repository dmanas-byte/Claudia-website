import { useEffect, useRef, useState } from 'react'
import { PLAYBOOK } from '../content/copy'
import { Shot } from '../ui/Shot'
import { Accent } from '../ui/Accent'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import { gsap } from '../lib/scroll'

/**
 * Six pinned beats. The active round swaps with the shot's progress; its
 * round card flips in (rotateY 90 → 0, 0.7s back.out(1.4)).
 */
export function Shot05Playbook() {
  const [active, setActive] = useState(0)
  const reduced = useSettings((s) => s.reducedMotion)
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsub = useScroll.subscribe((s) => {
      if (s.shot !== 4) return
      const n = Math.min(5, Math.floor(s.shotProgress * 6))
      setActive((a) => (a === n ? a : n))
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!stage.current) return
    const card = stage.current.querySelector<HTMLElement>('.round.is-active .round__card')
    const body = stage.current.querySelectorAll<HTMLElement>('.round.is-active .round__headline, .round.is-active .round__body, .round.is-active .round__get')
    if (!card) return
    if (reduced) {
      gsap.set([card, body], { clearProps: 'all' })
      return
    }
    const tl = gsap.timeline()
    tl.fromTo(card, { rotateY: 90, opacity: 0 }, { rotateY: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', overwrite: true })
    tl.fromTo(body, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.07, overwrite: true }, '-=0.45')
    return () => {
      tl.kill()
      gsap.set([card, body], { clearProps: 'opacity,transform' })
    }
  }, [active, reduced])

  return (
    <Shot id="05" frame="bottom-left" label="The program — six rounds" scrim="left">
      <div className="playbook">
        <div className="playbook__intro">
          <p className="shot__kicker mono">{PLAYBOOK.kicker}</p>
          <h2 className="display display--md shot__headline">
            <Accent text={PLAYBOOK.headline} />
          </h2>
        </div>
        <div className="playbook__stage" ref={stage}>
          {PLAYBOOK.rounds.map((r, i) => (
            <article className={`round ${i === active ? 'is-active' : ''}`} key={r.n} aria-hidden={i !== active} id={`round-${r.n}`}>
              <p className="round__card" style={{ perspective: 800 }}>
                <span className="mono mono--sm">Round</span>
                <b>
                  {r.n} <span style={{ fontWeight: 500, color: 'var(--ash)', fontSize: '0.8em' }}>of 6</span>
                </b>
              </p>
              <p className="round__name mono mono--sm ash">{r.name}</p>
              <h3 className="display round__headline">{r.headline}</h3>
              <p className="lede round__body">{r.body}</p>
              <p className="mono round__get">{r.get}</p>
            </article>
          ))}
        </div>
        <nav className="playbook__index" aria-label="Rounds">
          {PLAYBOOK.rounds.map((r, i) => (
            <span className={`playbook__dot ${i === active ? 'is-active' : ''}`} key={r.n} aria-current={i === active ? 'step' : undefined} title={r.name}>
              {r.n}
            </span>
          ))}
        </nav>
      </div>
    </Shot>
  )
}
