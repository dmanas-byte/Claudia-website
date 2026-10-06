import { useEffect, useRef } from 'react'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'

/** Hard cut: a single two-frame white flash whenever the shot changes. */
export function Flash() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useSettings((s) => s.reducedMotion)
  useEffect(() => {
    if (reduced) return
    let lastCuts = useScroll.getState().cuts
    let raf = 0
    let timer = 0
    const unsub = useScroll.subscribe((s) => {
      if (s.cuts === lastCuts || !ref.current) return
      lastCuts = s.cuts
      const el = ref.current
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      const t0 = performance.now()
      el.style.opacity = '0.82'
      const step = () => {
        const dt = performance.now() - t0
        if (dt < 18) el.style.opacity = '0.82'
        else if (dt < 36) el.style.opacity = '0.4'
        else {
          el.style.opacity = '0'
          return
        }
        raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
      // hard cap: two frames at 60 fps; never a visible grey veil on slow devices
      timer = window.setTimeout(() => {
        el.style.opacity = '0'
      }, 48)
    })
    return () => {
      unsub()
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [reduced])
  return <div className="flash" ref={ref} aria-hidden="true" />
}
