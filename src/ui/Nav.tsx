import { useEffect, useRef } from 'react'
import { BRAND, NAV } from '../content/copy'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import { gsap, scrollToAnchor } from '../lib/scroll'

export function Nav() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useSettings((s) => s.reducedMotion)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let hidden = false
    let lastY = 0
    const unsub = useScroll.subscribe((s) => {
      const y = s.scrollY
      const goingDown = y > lastY + 2
      const goingUp = y < lastY - 2
      lastY = y
      if (goingDown && y > 120 && !hidden) {
        hidden = true
        gsap.to(el, { yPercent: -110, duration: reduced ? 0 : 0.4, ease: 'power2.out', overwrite: true })
      } else if ((goingUp || y < 80) && hidden) {
        hidden = false
        gsap.to(el, { yPercent: 0, duration: reduced ? 0 : 0.4, ease: 'power2.out', overwrite: true })
      }
    })
    return unsub
  }, [reduced])

  const go = (anchor: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToAnchor(anchor)
  }

  return (
    <header className="nav" ref={ref}>
      <a href="#walkout" className="nav__mark" onClick={go('walkout')} aria-label={`${BRAND.wordmark} — back to top`}>
        {BRAND.wordmark}
        <small>{BRAND.tagline}</small>
      </a>
      <nav className="nav__links" aria-label="Primary">
        <a href="#program" className="nav__link" onClick={go('program')}>
          {NAV.program}
        </a>
        <a href="#story" className="nav__link" onClick={go('story')}>
          {NAV.story}
        </a>
        <a href="#apply" className="btn btn--gold btn--sm nav__cta" onClick={go('apply')}>
          {NAV.cta}
        </a>
      </nav>
    </header>
  )
}
