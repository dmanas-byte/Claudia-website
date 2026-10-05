import { useEffect, useRef } from 'react'
import { useSettings } from '../store/useSettings'

/** Runtime-generated noise tile (no external image). Desktop only. */
function makeNoise(size = 160): string {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  if (!ctx) return ''
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL('image/png')
}

export function Grain() {
  const lowPower = useSettings((s) => s.lowPower)
  const reduced = useSettings((s) => s.reducedMotion)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || lowPower) return
    ref.current.style.backgroundImage = `url(${makeNoise()})`
  }, [lowPower])
  return (
    <>
      <div className="vignette" aria-hidden="true" />
      {!lowPower && <div className="grain" ref={ref} aria-hidden="true" style={reduced ? { animation: 'none' } : undefined} />}
    </>
  )
}
