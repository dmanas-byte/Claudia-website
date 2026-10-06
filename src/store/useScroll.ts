import { create } from 'zustand'
import { SHOTS } from '../content/shots'
import { clamp } from '../lib/math'

export interface ShotRange {
  index: number
  /** document px where the shot starts */
  top: number
  /** document px where the shot ends */
  bottom: number
}

export interface ScrollState {
  /** 0..1 over the whole document */
  progress: number
  /** px */
  scrollY: number
  /** px per second, signed, smoothed */
  velocity: number
  /** |velocity| normalized 0..1 for shaders */
  wind: number
  /** current shot index */
  shot: number
  /** 0..1 within the current shot */
  shotProgress: number
  /** continuous shot position, e.g. 3.42 = 42% through shot 3 */
  shotFloat: number
  /** measured shot ranges */
  ranges: ShotRange[]
  /** normalized pointer -1..1 (x right, y up) */
  pointer: { x: number; y: number }
  /** pointer in page px for the floor spot raycast */
  pointerPx: { x: number; y: number }
  /** 0..1 hard-cut flash energy, decays each frame */
  flash: number
  /** cheap counter so subscribers can react to a cut */
  cuts: number
  viewport: { w: number; h: number }
  setRanges: (ranges: ShotRange[]) => void
  setScroll: (y: number, dt: number) => void
  setPointer: (x: number, y: number) => void
  triggerFlash: (energy?: number) => void
  decayFlash: (dt: number) => void
  setViewport: (w: number, h: number) => void
}

export const useScroll = create<ScrollState>((set, get) => ({
  progress: 0,
  scrollY: 0,
  velocity: 0,
  wind: 0,
  shot: 0,
  shotProgress: 0,
  shotFloat: 0,
  ranges: [],
  pointer: { x: 0, y: 0 },
  pointerPx: { x: -1e4, y: -1e4 },
  flash: 0,
  cuts: 0,
  viewport: { w: typeof window === 'undefined' ? 1440 : window.innerWidth, h: typeof window === 'undefined' ? 900 : window.innerHeight },

  setRanges: (ranges) => {
    set({ ranges })
    get().setScroll(get().scrollY, 0)
  },

  setScroll: (y, dt) => {
    const s = get()
    const ranges = s.ranges
    const docEnd = ranges.length ? ranges[ranges.length - 1].bottom - s.viewport.h : 1
    const progress = clamp(y / Math.max(1, docEnd))

    // which shot are we in? A shot becomes "current" once its section covers
    // the middle of the viewport, so cuts land while the next frame is already
    // the dominant thing on screen.
    let shot = 0
    let shotProgress = 0
    if (ranges.length) {
      const mid = y + s.viewport.h * 0.5
      for (let i = ranges.length - 1; i >= 0; i--) {
        if (mid >= ranges[i].top - 0.5 && ranges[i].bottom > ranges[i].top) {
          shot = i
          break
        }
      }
      const r = ranges[shot]
      const len = Math.max(1, r.bottom - r.top - s.viewport.h)
      shotProgress = clamp((y - r.top) / len)
      // the very last shot: ensure we reach 1
      if (shot === ranges.length - 1 && y >= docEnd - 1) shotProgress = 1
    }

    const vel = dt > 0 ? (y - s.scrollY) / dt : s.velocity
    const velocity = dt > 0 ? s.velocity + (vel - s.velocity) * Math.min(1, dt * 8) : s.velocity
    const wind = clamp(Math.abs(velocity) / 2500)

    const cut = shot !== s.shot
    set({
      progress,
      scrollY: y,
      velocity,
      wind,
      shot,
      shotProgress,
      shotFloat: shot + shotProgress,
      ...(cut ? { flash: 1, cuts: s.cuts + 1 } : {}),
    })
  },

  setPointer: (x, y) => {
    const { w, h } = get().viewport
    set({ pointer: { x: (x / w) * 2 - 1, y: -(y / h) * 2 + 1 }, pointerPx: { x, y } })
  },

  triggerFlash: (energy = 1) => set({ flash: Math.max(get().flash, energy) }),

  decayFlash: (dt) => {
    const f = get().flash
    if (f > 0.001) set({ flash: f * Math.exp(-dt * 14) })
    else if (f !== 0) set({ flash: 0 })
  },

  setViewport: (w, h) => set({ viewport: { w, h } }),
}))

/** Measure every [data-shot] section and store its document range. */
export function measureShots() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-shot]'))
  const ranges: ShotRange[] = []
  const scrollY = window.scrollY
  for (const el of els) {
    const idx = SHOTS.findIndex((s) => s.id === el.dataset.shot)
    if (idx < 0) continue
    const rect = el.getBoundingClientRect()
    ranges[idx] = { index: idx, top: rect.top + scrollY, bottom: rect.bottom + scrollY }
  }
  // fill gaps defensively
  for (let i = 0; i < SHOTS.length; i++) {
    if (!ranges[i]) ranges[i] = { index: i, top: ranges[i - 1]?.bottom ?? 0, bottom: (ranges[i - 1]?.bottom ?? 0) + window.innerHeight }
  }
  useScroll.getState().setViewport(window.innerWidth, window.innerHeight)
  useScroll.getState().setRanges(ranges)
  return ranges
}

/**
 * Local progress helper for a given shot index with optional sub-range.
 * Returns 0 before the shot, 1 after it, and the eased position inside.
 */
export function shotLocal(shotFloat: number, index: number, from = 0, to = 1) {
  const p = clamp(shotFloat - index)
  return clamp((p - from) / (to - from))
}

/**
 * Smooth cross-shot progress: 0 at start of `a`, 1 at end of `b` (inclusive).
 */
export function spanProgress(shotFloat: number, a: number, b: number) {
  return clamp((shotFloat - a) / (b + 1 - a))
}
