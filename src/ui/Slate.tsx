import { useEffect, useRef, useState } from 'react'
import { SHOTS, SHOT_COUNT } from '../content/shots'
import { useScroll } from '../store/useScroll'

/** Bottom-left slate: "SHOT 03 / 12 — THE JOURNEY", cross-fades per shot. */
export function Slate() {
  const shot = useScroll((s) => s.shot)
  const [shown, setShown] = useState(shot)
  const [switching, setSwitching] = useState(false)
  const t = useRef<number>(0)

  useEffect(() => {
    if (shot === shown) return
    setSwitching(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => {
      setShown(shot)
      setSwitching(false)
    }, 150)
    return () => window.clearTimeout(t.current)
  }, [shot, shown])

  const def = SHOTS[shown]
  return (
    <div className={`slate mono ${switching ? 'is-switching' : ''}`} aria-live="polite" aria-atomic="true">
      <span>
        Shot {def.id} / {String(SHOT_COUNT).padStart(2, '0')}
      </span>
      <span className="ash">— {def.title}</span>
    </div>
  )
}
