import { useEffect, useRef } from 'react'
import { PLATES, plateAt, plateSrc, plateVideo, type PlateId } from '../content/film'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import './film.css'

/**
 * The film behind the copy: full-bleed Higgsfield plates, one per beat.
 * The current plate is shown, the others wait at opacity 0; a change of plate
 * crossfades. Inside a plate the picture drifts slowly with scroll. Driven
 * from the scroll store without React renders.
 */
export function Film() {
  const root = useRef<HTMLDivElement>(null)
  const lowPower = useSettings((s) => s.lowPower)
  const reduced = useSettings((s) => s.reducedMotion)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const plates = new Map<PlateId, HTMLElement>()
    el.querySelectorAll<HTMLElement>('[data-plate]').forEach((p) => plates.set(p.dataset.plate as PlateId, p))
    const order = PLATES.map((p) => p.id)
    let current: PlateId | null = null

    const load = (id: PlateId) => {
      const p = plates.get(id)
      const img = p?.querySelector('img')
      if (img && !img.getAttribute('src')) {
        img.srcset = img.dataset.srcset!
        img.src = img.dataset.src!
      }
    }
    const playVideo = (id: PlateId, on: boolean) => {
      const v = plates.get(id)?.querySelector('video')
      if (!v || reduced) return
      if (on) {
        if (!v.getAttribute('src')) v.src = v.dataset.src!
        v.play().catch(() => {})
      } else {
        window.setTimeout(() => {
          if (current !== id) v.pause()
        }, 1200)
      }
    }

    const apply = () => {
      const s = useScroll.getState()
      const { id, local } = plateAt(s.shot, s.shotProgress)
      if (id !== current) {
        const prev = current
        current = id
        if (prev) plates.get(prev)?.classList.remove('is-active')
        load(id)
        plates.get(id)?.classList.add('is-active')
        if (prev) playVideo(prev, false)
        playVideo(id, true)
        // warm the next two plates so their crossfade never shows black
        const i = order.indexOf(id)
        order.slice(i + 1, i + 3).forEach(load)
      }
      if (!reduced) plates.get(id)?.style.setProperty('--p', local.toFixed(4))
    }
    apply()
    return useScroll.subscribe(apply)
  }, [reduced])

  return (
    <div className={`film ${reduced ? 'film--still' : ''}`} ref={root} aria-hidden="true">
      {PLATES.map((p) => (
        <div className="film__plate" data-plate={p.id} key={p.id} style={{ ['--focus' as string]: p.focus }}>
          <img
            className="film__img"
            alt=""
            decoding="async"
            data-src={plateSrc(p.id, 1920)}
            data-srcset={`${plateSrc(p.id, 1080)} 1080w, ${plateSrc(p.id, 1920)} 1920w`}
            sizes="100vw"
          />
          {p.video && !reduced && (
            <video
              className="film__video"
              data-src={plateVideo(p.id, lowPower)}
              muted
              loop
              playsInline
              preload="none"
              onPlaying={(e) => e.currentTarget.classList.add('is-playing')}
            />
          )}
        </div>
      ))}
      <div className="film__shade" />
    </div>
  )
}
