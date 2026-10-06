import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { measureShots, useScroll } from '../store/useScroll'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let started = false

export function getLenis() {
  return lenis
}

/**
 * Boot the scroll system once. Smooth scroll (Lenis) is skipped under reduced
 * motion; the store still updates from native scroll so every shot works.
 */
export function initScroll({ smooth }: { smooth: boolean }) {
  if (started) return
  started = true

  if (smooth) {
    lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      anchors: { offset: 0 },
    })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('lenis', 'lenis-smooth')
  }

  let last = performance.now()
  gsap.ticker.add(() => {
    const now = performance.now()
    const dt = Math.min(0.1, (now - last) / 1000)
    last = now
    const st = useScroll.getState()
    st.setScroll(window.scrollY, dt)
    st.decayFlash(dt)
  })

  const remeasure = () => {
    measureShots()
    ScrollTrigger.refresh()
  }
  measureShots()
  window.addEventListener('resize', remeasure, { passive: true })
  window.addEventListener('load', remeasure)
  // fonts and lazy chunks can change layout
  document.fonts?.ready.then(remeasure).catch(() => {})
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => measureShots())
    ro.observe(document.body)
  }

  const onPointer = (e: PointerEvent) => useScroll.getState().setPointer(e.clientX, e.clientY)
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('pointerdown', onPointer, { passive: true })
  window.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0]
      if (t) useScroll.getState().setPointer(t.clientX, t.clientY)
    },
    { passive: true },
  )
}

export function scrollToAnchor(anchor: string, opts: { immediate?: boolean } = {}) {
  const el = document.getElementById(anchor)
  if (!el) return
  if (lenis) {
    // page height may have changed (route change, fonts): refresh limits first
    lenis.resize()
    lenis.scrollTo(el, { immediate: opts.immediate, duration: 1.4, offset: 0 })
  } else {
    el.scrollIntoView({ behavior: opts.immediate ? 'auto' : 'smooth', block: 'start' })
  }
}

export function stopScroll() {
  lenis?.stop()
  document.documentElement.classList.add('lenis-stopped')
}
export function startScroll() {
  lenis?.start()
  document.documentElement.classList.remove('lenis-stopped')
}

export { gsap, ScrollTrigger }
