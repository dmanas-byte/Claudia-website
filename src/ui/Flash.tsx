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
    const unsub = useScroll.subscribe((s) => {
      if (s.cuts === lastCuts || !ref.current) return
      lastCuts = s.cuts
      const el = ref.current
      cancelAnimationFrame(raf)
      el.style.opacity = '0.82'
      raf = requestAnimationFrame(() => {
        el.style.opacity = '0.4'
        raf = requestAnimationFrame(() => {
          el.style.opacity = '0'
        })
      })
    })
    return () => {
      unsub()
      cancelAnimationFrame(raf)
    }
  }, [reduced])
  return <div className="flash" ref={ref} aria-hidden="true" />
}
