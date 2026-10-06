import { useEffect } from 'react'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import { gsap } from '../lib/scroll'

/**
 * 2.39:1 letterbox bars: slide in during camera moves (shot edges, fast
 * scroll) and out during reading moments. Static thin bars under reduced motion.
 */
export function Letterbox() {
  const reduced = useSettings((s) => s.reducedMotion)
  useEffect(() => {
    const root = document.documentElement
    if (reduced) {
      root.style.setProperty('--letterbox', '18px')
      return () => root.style.setProperty('--letterbox', '0px')
    }
    const target = { h: 0 }
    const setter = gsap.quickTo(target, 'h', {
      duration: 0.55,
      ease: 'power3.inOut',
      onUpdate: () => root.style.setProperty('--letterbox', `${target.h.toFixed(1)}px`),
    })
    let lastWanted = -1
    const unsub = useScroll.subscribe((s) => {
      const { w, h } = s.viewport
      const full = Math.max(0, (h - w / 2.39) / 2)
      const maxBar = Math.min(full, h * 0.11)
      const atEnd = s.progress > 0.985 // footer: a reading moment
      const edge = !atEnd && (s.shotProgress > 0.93 || (s.shotProgress < 0.07 && s.shot > 0))
      const moving = s.wind > 0.18 && !atEnd
      const wanted = edge || moving ? maxBar : 0
      if (wanted !== lastWanted) {
        lastWanted = wanted
        setter(wanted)
      }
    })
    return () => {
      unsub()
      root.style.setProperty('--letterbox', '0px')
    }
  }, [reduced])
  return (
    <>
      <div className="letterbox letterbox--top" aria-hidden="true" />
      <div className="letterbox letterbox--bottom" aria-hidden="true" />
    </>
  )
}
