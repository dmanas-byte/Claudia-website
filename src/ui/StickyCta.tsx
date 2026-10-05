import { useEffect, useState } from 'react'
import { CTA } from '../content/copy'
import { useScroll } from '../store/useScroll'
import { scrollToAnchor } from '../lib/scroll'

/** Mobile sticky pill: appears after the hero, never covers form inputs. */
export function StickyCta() {
  const shot = useScroll((s) => s.shot)
  const [formFocused, setFormFocused] = useState(false)
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement
      setFormFocused(!!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'))
    }
    const onBlur = () => setFormFocused(false)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', onBlur)
    return () => {
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('focusout', onBlur)
    }
  }, [])
  // hidden on the hero, on the apply shot (the form is right there) and when typing
  const formShot = shot === 9
  const visible = shot >= 1 && !formShot && !formFocused
  return (
    <div className={`sticky-cta ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <a
        href="#apply"
        className="btn btn--gold"
        tabIndex={visible ? 0 : -1}
        onClick={(e) => {
          e.preventDefault()
          scrollToAnchor('apply')
        }}
      >
        {CTA.applyShort}
      </a>
    </div>
  )
}
