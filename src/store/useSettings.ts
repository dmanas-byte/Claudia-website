import { create } from 'zustand'
import { isLowPower, isTouchDevice, prefersReducedMotion } from '../lib/device'

const LS_MOTION = 'walkout:motion'
const LS_SOUND = 'walkout:sound'

export interface SettingsState {
  /** reduced motion (media query OR footer toggle) */
  reducedMotion: boolean
  /** user explicitly toggled (persists) */
  motionOverride: boolean | null
  touch: boolean
  /** cheaper production: mobile / low-power */
  lowPower: boolean
  sound: boolean
  /** cold open already played this session */
  preloaderDone: boolean
  /** the cold open for THIS page load has finished (or was skipped) */
  introDone: boolean
  setIntroDone: () => void
  setReducedMotion: (v: boolean) => void
  setSound: (v: boolean) => void
  setPreloaderDone: () => void
  refresh: () => void
}

const readMotionOverride = (): boolean | null => {
  try {
    const v = localStorage.getItem(LS_MOTION)
    return v === null ? null : v === 'reduce'
  } catch {
    return null
  }
}

const computeReduced = (override: boolean | null) => (override === null ? prefersReducedMotion() : override)

export const useSettings = create<SettingsState>((set, get) => {
  const override = readMotionOverride()
  return {
    reducedMotion: computeReduced(override),
    motionOverride: override,
    touch: isTouchDevice(),
    lowPower: isLowPower(),
    sound: (() => {
      try {
        return localStorage.getItem(LS_SOUND) === 'on'
      } catch {
        return false
      }
    })(),
    preloaderDone: (() => {
      try {
        return sessionStorage.getItem('walkout:coldopen') === '1'
      } catch {
        return false
      }
    })(),
    setReducedMotion: (v) => {
      try {
        localStorage.setItem(LS_MOTION, v ? 'reduce' : 'full')
      } catch {
        /* ignore */
      }
      set({ reducedMotion: v, motionOverride: v })
      document.documentElement.dataset.motion = v ? 'reduce' : 'full'
    },
    setSound: (v) => {
      try {
        localStorage.setItem(LS_SOUND, v ? 'on' : 'off')
      } catch {
        /* ignore */
      }
      set({ sound: v })
    },
    introDone: false,
    setIntroDone: () => set({ introDone: true }),
    setPreloaderDone: () => {
      try {
        sessionStorage.setItem('walkout:coldopen', '1')
      } catch {
        /* ignore */
      }
      set({ preloaderDone: true })
    },
    refresh: () => set({ lowPower: isLowPower(), reducedMotion: computeReduced(get().motionOverride) }),
  }
})

/** apply initial html[data-motion] + keep in sync with the OS setting */
export function initSettings() {
  const s = useSettings.getState()
  document.documentElement.dataset.motion = s.reducedMotion ? 'reduce' : 'full'
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onChange = () => {
    if (useSettings.getState().motionOverride === null) {
      const v = mq.matches
      useSettings.setState({ reducedMotion: v })
      document.documentElement.dataset.motion = v ? 'reduce' : 'full'
    }
  }
  mq.addEventListener?.('change', onChange)
  window.addEventListener('resize', () => useSettings.getState().refresh(), { passive: true })
}
