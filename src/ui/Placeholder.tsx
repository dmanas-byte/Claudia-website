import { IMAGE_SLOTS } from '../content/placeholders'

/**
 * Designed placeholder frame: dark frame, thin gold rule, mono caption with
 * exact aspect ratio. Renders the real image once `src` is filled in
 * src/content/placeholders.ts.
 */
export function ImageSlotFrame({ slot, className }: { slot: string; className?: string }) {
  const s = IMAGE_SLOTS[slot]
  if (!s) return null
  if (s.src) {
    return (
      <figure className={className} style={{ aspectRatio: s.aspect }}>
        <img src={s.src} alt={s.alt} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </figure>
    )
  }
  return (
    <div className={`ph ${className ?? ''}`} style={{ aspectRatio: s.aspect }} role="img" aria-label={`Placeholder: ${s.depicts}`}>
      <p className="ph__caption mono mono--sm">
        <strong>Owner to supply</strong>
        {s.depicts}
      </p>
      <span className="ph__spec mono mono--sm" aria-hidden="true">
        {s.size} · {s.aspect.replace(/\s/g, '')}
      </span>
    </div>
  )
}

/** Inline token for an unknown value, e.g. [PRICING — OWNER TO SUPPLY] */
export function Token({ children }: { children: string }) {
  return <span className="tok">{children}</span>
}
