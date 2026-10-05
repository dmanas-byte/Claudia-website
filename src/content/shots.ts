/**
 * The shot list. Order here is the order on the page; `heightVh` is how much
 * scroll each shot owns (pinned shots own more so the camera has time to
 * move). The scroll store measures the real DOM and maps scroll to a global
 * 0–1 progress plus a per-shot 0–1 progress that drives the camera and every
 * shader uniform.
 */
export interface ShotDef {
  /** two-digit id used in data-shot and anchors */
  id: string
  /** 0-based index */
  index: number
  /** slate title, uppercase mono */
  title: string
  /** DOM anchor id */
  anchor: string
  /** scroll length in vh (desktop) */
  heightVh: number
  /** scroll length in vh (mobile) */
  heightVhMobile: number
  /** is the copy pinned (sticky) while the camera moves */
  pinned: boolean
  /** pinned on mobile too? tall shots (timeline, forms) flow naturally there */
  pinnedMobile?: boolean
}

const defs: Omit<ShotDef, 'index'>[] = [
  { id: '01', title: 'THE WALKOUT', anchor: 'walkout', heightVh: 160, heightVhMobile: 140, pinned: true },
  { id: '02', title: 'TALE OF THE TAPE', anchor: 'tape', heightVh: 220, heightVhMobile: 180, pinned: true },
  { id: '03', title: 'THE BACKPACK', anchor: 'backpack', heightVh: 260, heightVhMobile: 200, pinned: true },
  { id: '04', title: 'THE RECORD', anchor: 'story', heightVh: 380, heightVhMobile: 140, pinned: true, pinnedMobile: false },
  { id: '05', title: 'THE PLAYBOOK', anchor: 'program', heightVh: 720, heightVhMobile: 620, pinned: true },
  { id: '06', title: 'THE TERMINAL', anchor: 'terminal', heightVh: 220, heightVhMobile: 180, pinned: true },
  { id: '07', title: 'THE ALERT', anchor: 'alert', heightVh: 200, heightVhMobile: 160, pinned: true },
  { id: '08', title: 'THE CORNER', anchor: 'corner', heightVh: 220, heightVhMobile: 170, pinned: true },
  { id: '09', title: 'THE 30-DAY CHALLENGE', anchor: 'challenge', heightVh: 260, heightVhMobile: 160, pinned: true, pinnedMobile: false },
  { id: '10', title: 'APPLY', anchor: 'apply', heightVh: 160, heightVhMobile: 130, pinned: false },
  { id: '11', title: 'PROOF WALL', anchor: 'proof', heightVh: 120, heightVhMobile: 110, pinned: false },
  { id: '12', title: 'THE CRANE', anchor: 'finale', heightVh: 240, heightVhMobile: 190, pinned: true },
]

export const SHOTS: ShotDef[] = defs.map((d, index) => ({ ...d, index }))
export const SHOT_COUNT = SHOTS.length
export const shotByAnchor = (anchor: string) => SHOTS.find((s) => s.anchor === anchor)
export const shotIndexById = (id: string) => SHOTS.findIndex((s) => s.id === id)
