import type { CSSProperties, ReactNode } from 'react'
import { SHOTS } from '../content/shots'
import { useSettings } from '../store/useSettings'

interface ShotProps {
  id: string
  children: ReactNode
  /** override the pinned frame alignment class */
  frame?: 'bottom-left' | 'center-left' | 'center' | 'top-left' | 'right'
  className?: string
  style?: CSSProperties
  /** aria label for the section landmark */
  label: string
}

/**
 * Section wrapper. Sets the scroll length from the shot list, exposes
 * data-shot for measurement and the anchor id for deep links.
 */
export function Shot({ id, children, frame = 'bottom-left', className, style, label }: ShotProps) {
  const def = SHOTS.find((s) => s.id === id)!
  const lowPower = useSettings((s) => s.lowPower)
  const reduced = useSettings((s) => s.reducedMotion)
  const h = reduced ? Math.min(def.heightVh, 140) : lowPower ? def.heightVhMobile : def.heightVh
  const pinned = def.pinned && !(lowPower && def.pinnedMobile === false)
  return (
    <section
      id={def.anchor}
      data-shot={id}
      className={`shot shot--${id} ${className ?? ''}`}
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
