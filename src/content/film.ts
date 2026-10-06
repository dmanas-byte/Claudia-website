import { asset } from '../lib/env'

/**
 * The scroll visuals: one Higgsfield-generated plate per beat of the film.
 * Each plate is a still (public/film/<id>-1920.webp / -1080.webp) and, for a
 * few key beats, a silent looping video (public/film/<id>.mp4 / -720.mp4).
 * Every plate is composed with dark space on the left, where the copy sits.
 *
 * To swap a picture: replace the file in public/film/ (same name), or
 * regenerate from art/ with `node scripts/process-art.mjs`.
 */
export type PlateId =
  | 'hero'
  | 'tape'
  | 'backpack'
  | 'fighter'
  | 'architect'
  | 'record'
  | 'round1'
  | 'round2'
  | 'round3'
  | 'round4'
  | 'round5'
  | 'round6'
  | 'terminal'
  | 'alert'
  | 'corner'
  | 'rig'
  | 'apply'
  | 'finale'

export interface Plate {
  id: PlateId
  /** what the picture shows and why it is in this section (for the owner) */
  note: string
  video?: boolean
  /** object-position on narrow screens, where only a slice of the frame shows */
  focus: string
}

export const PLATES: Plate[] = [
  { id: 'hero', note: 'Empty cage under two spotlights: the moment before the walkout.', video: true, focus: '68% 50%' },
  { id: 'tape', note: 'Cage fence in a spotlight: fight-night broadcast for her tale of the tape.', focus: '78% 50%' },
  { id: 'backpack', note: 'A teenager’s backpack on a highway near Mossoró at dawn: she hitchhiked from here at 15.', video: true, focus: '74% 60%' },
  { id: 'fighter', note: 'MMA gloves and hand wraps on a locker-room bench: her UFC years.', focus: '76% 55%' },
  { id: 'architect', note: 'Desk with blueprints over a city at night: building wealth through real estate and markets.', focus: '70% 55%' },
  { id: 'record', note: 'Dark arena seats: backdrop for her fight record.', focus: '70% 40%' },
  { id: 'round1', note: 'Notebook and chart: the yearly portfolio playbook.', focus: '74% 60%' },
  { id: 'round2', note: 'A phone lighting up: a text for every order she places.', focus: '78% 50%' },
  { id: 'round3', note: 'Trading screens and an options payoff sketch: options training and signals.', focus: '72% 50%' },
  { id: 'round4', note: 'A laptop on a video call: the live weekly calls.', focus: '78% 50%' },
  { id: 'round5', note: 'Vacation home with a heated pool: her Orlando Airbnb is a 5-bedroom with a heated pool.', focus: '66% 55%' },
  { id: 'round6', note: 'House keys and a signed contract: real-estate deals from her network.', focus: '72% 55%' },
  { id: 'terminal', note: 'An empty trading floor at night: the money world nobody taught you.', video: true, focus: '70% 45%' },
  { id: 'alert', note: 'A phone glowing on the locker-room bench: a trade alert arriving.', focus: '72% 55%' },
  { id: 'corner', note: 'From inside the cage, a crowd of phone lights: nobody builds alone.', focus: '60% 40%' },
  { id: 'rig', note: 'Arena lights switching on: this is for you if you are done waiting.', focus: '50% 40%' },
  { id: 'apply', note: 'An empty corner stool: book a call with a coach in your corner.', focus: '76% 60%' },
  { id: 'finale', note: 'The walkout tunnel toward the light: your walkout starts here.', video: true, focus: '50% 60%' },
]

export const plateSrc = (id: PlateId, w: 1920 | 1080) => asset(`/film/${id}-${w}.webp`)
/** H.264 where the browser has it (best on phones), VP9 WebM otherwise. */
export const plateVideo = (id: PlateId, small: boolean) => {
  const t = document.createElement('video')
  const ext = t.canPlayType('video/mp4; codecs="avc1.640028"') ? 'mp4' : 'webm'
  return asset(`/film/${id}${small ? '-720' : ''}.${ext}`)
}

/** Journey beats inside SHOT 03 (shared with the copy). */
export const JOURNEY_BEATS = [0, 0.34, 0.66, 1] as const

/** Which plate the film shows, and how far through that plate we are (0..1). */
export function plateAt(shot: number, p: number): { id: PlateId; local: number } {
  switch (shot) {
    case 0:
      return { id: 'hero', local: p }
    case 1:
      return { id: 'tape', local: p }
    case 2: {
      const b = JOURNEY_BEATS
      const i = p >= b[2] ? 2 : p >= b[1] ? 1 : 0
      const ids: PlateId[] = ['backpack', 'fighter', 'architect']
      return { id: ids[i], local: (p - b[i]) / (b[i + 1] - b[i]) }
    }
    case 3:
      return { id: 'record', local: p }
    case 4: {
      const i = Math.min(5, Math.floor(p * 6))
      return { id: `round${i + 1}` as PlateId, local: p * 6 - i }
    }
    case 5:
      return { id: 'terminal', local: p }
    case 6:
      return { id: 'alert', local: p }
    case 7:
      return { id: 'corner', local: p }
    case 8:
      return { id: 'rig', local: p }
    case 9:
      return { id: 'apply', local: p }
    case 10:
      return { id: 'record', local: p }
    default:
      return { id: 'finale', local: p }
  }
}
