import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { SHOTS } from '../content/shots'
import { useSettings } from '../store/useSettings'
import { useScroll } from '../store/useScroll'

interface ShotProps {
  id: string
  children: ReactNode
  /** override the pinned frame alignment class */
  frame?: 'bottom-left' | 'center-left' | 'center' | 'top-left' | 'right'
  className?: string
  style?: CSSProperties
  /** aria label for the section landmark */
  label: string
  /** darken the copy side of the frame when the set behind is bright */
  scrim?: 'left' | 'right' | 'full' | 'center'
}

/**
 * Section wrapper. Sets the scroll length from the shot list, exposes
 * data-shot for measurement and the anchor id for deep links.
 */
export function Shot({ id, children, frame = 'bottom-left', className, style, label, scrim }: ShotProps) {
  const def = SHOTS.find((s) => s.id === id)!
  const lowPower = useSettings((s) => s.lowPower)
  const reduced = useSettings((s) => s.reducedMotion)
  const h = reduced ? Math.min(def.heightVh, 140) : lowPower ? def.heightVhMobile : def.heightVh
  const pinned = def.pinned && !(lowPower && def.pinnedMobile === false)
  const ref = useRef<HTMLElement>(null)

  // Pinned frames are position: fixed while their shot is current, hidden
  // otherwise: a real hard cut, never a slide. Toggled without re-rendering.
  useEffect(() => {
    const el = ref.current
    if (!el || !pinned) return
    const apply = (shot: number) => el.classList.toggle('is-active', shot === def.index)
    apply(useScroll.getState().shot)
    return useScroll.subscribe((s) => apply(s.shot))
  }, [pinned, def.index])

  return (
    <section
      ref={ref}
      id={def.anchor}
      data-shot={id}
      className={`shot shot--${id} ${pinned ? 'shot--pinned' : 'shot--flow'} ${scrim ? `shot--scrim shot--scrim-${scrim}` : ''} ${className ?? ''}`}
      style={{ height: pinned ? `${h}vh` : undefined, minHeight: pinned ? undefined : `${h}vh`, ...style }}
      aria-label={label}
    >
      {pinned ? (
        <div className="shot__pin">
          <div className={`shot__frame shot__frame--${frame}`}>{children}</div>
        </div>
      ) : (
        <div className={`shot__frame shot__frame--${frame}`}>{children}</div>
      )}
    </section>
  )
}
