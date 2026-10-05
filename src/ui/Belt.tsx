import { useEffect, useRef } from 'react'
import { useScroll } from '../store/useScroll'

/**
 * The Belt — page progress as a BJJ belt. White → blue → purple → brown →
 * black as you scroll, then four red-bar degree stripes (one per quarter)
 * that tick on with a 120 ms gold flash, and a knot that ties at 100 %.
 * Set BELT_SKIP_PURPLE if the owner wants the rank sequence without purple.
 */
const BELT_SKIP_PURPLE = false

const RANKS = BELT_SKIP_PURPLE
  ? ['#f2eee6', '#2f5fae', '#6b4a2b', '#111114']
  : ['#f2eee6', '#2f5fae', '#4a3466', '#6b4a2b', '#111114']

function hexToRgb(h: string) {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const RANK_RGB = RANKS.map(hexToRgb)

function beltColor(p: number) {
  const segs = RANK_RGB.length - 1
  const x = Math.min(0.9999, Math.max(0, p)) * segs
  const i = Math.floor(x)
  const t = x - i
  const a = RANK_RGB[i]
  const b = RANK_RGB[i + 1]
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return `rgb(${r},${g},${bl})`
}

export function Belt() {
  const fill = useRef<HTMLDivElement>(null)
  const degrees = useRef<HTMLDivElement>(null)
  const knot = useRef<SVGSVGElement>(null)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let earned = 0
    let tied = false
    const timers: number[] = []
    const unsub = useScroll.subscribe((s) => {
      const p = s.progress
      if (fill.current) {
        fill.current.style.width = `${(p * 100).toFixed(2)}%`
        fill.current.style.backgroundColor = beltColor(p)
      }
      root.current?.setAttribute('aria-valuenow', String(Math.round(p * 100)))
      const want = Math.min(4, Math.floor(p * 4 + 1e-6))
      if (degrees.current) {
        degrees.current.classList.toggle('is-on', p > 0.72)
        const stripes = degrees.current.children
        if (want !== earned) {
          for (let i = 0; i < 4; i++) {
            const el = stripes[i] as HTMLElement
            const on = i < want
            if (on && !el.classList.contains('is-earned')) {
              el.classList.add('is-flash')
              timers.push(
                window.setTimeout(() => {
                  el.classList.remove('is-flash')
                }, 120),
              )
            }
            el.classList.toggle('is-earned', on)
          }
          earned = want
        }
      }
      const shouldTie = p >= 0.995
      if (shouldTie !== tied && knot.current) {
        tied = shouldTie
        knot.current.classList.toggle('is-tied', tied)
      }
    })
    return () => {
      unsub()
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="belt" ref={root} role="progressbar" aria-label="Page progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <div className="belt__fill" ref={fill} />
      <div className="belt__degrees" ref={degrees} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <svg className="belt__knot" ref={knot} viewBox="0 0 44 22" aria-hidden="true">
        <path d="M2 11 C 10 2, 18 2, 22 11 S 34 20, 42 11 M 2 11 C 10 20, 18 20, 22 11 S 34 2, 42 11" />
      </svg>
    </div>
  )
}
