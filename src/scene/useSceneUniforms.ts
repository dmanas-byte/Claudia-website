import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'

/**
 * Per-frame snapshot for shaders/objects. Call inside useFrame; never in render.
 * `local(i, from, to)` gives 0..1 progress inside shot i between two sub-points.
 */
export function readScene() {
  const s = useScroll.getState()
  const st = useSettings.getState()
  const sf = s.shotFloat
  return {
    shot: s.shot,
    shotProgress: s.shotProgress,
    shotFloat: sf,
    progress: s.progress,
    wind: s.wind,
    flash: s.flash,
    pointer: s.pointer,
    reduced: st.reducedMotion,
    lowPower: st.lowPower,
    /** 0 before shot i, 1 after; eased position inside [from,to] of shot i */
    local: (i: number, from = 0, to = 1) => {
      const p = Math.min(1, Math.max(0, sf - i))
      return Math.min(1, Math.max(0, (p - from) / (to - from)))
    },
    /** 0 at start of shot a → 1 at end of shot b */
    span: (a: number, b: number) => Math.min(1, Math.max(0, (sf - a) / (b + 1 - a))),
  }
}
export type SceneRead = ReturnType<typeof readScene>
