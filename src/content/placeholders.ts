/**
 * Every unknown on the site lives here. Each constant is rendered visibly as
 * a labeled placeholder and listed in ASSETS_NEEDED.md. Swap one line to
 * replace it. Never replace a placeholder with an invented value.
 */
export const PLACEHOLDER_PRICING = '[PRICING — OWNER TO SUPPLY]'
export const PLACEHOLDER_MEMBER_COUNT = '[MEMBER COUNT — OWNER TO SUPPLY]'
export const PLACEHOLDER_CALL_SCHEDULE = '[DAY/TIME — OWNER TO SUPPLY]'
export const PLACEHOLDER_ALERT_TIMESTAMP = '[SAMPLE]'
export const PLACEHOLDER_TESTIMONIAL = 'TESTIMONIAL — OWNER TO SUPPLY (name, role, permission on file)'
export const PLACEHOLDER_YEAR = '[YEAR]'
export const PLACEHOLDER_LEGAL_BODY = '[OWNER TO SUPPLY]'
export const PLACEHOLDER_DATE = '[DATE — VERIFY]'

/** Image slots. `src` empty ⇒ designed placeholder frame renders instead. */
export interface ImageSlot {
  id: string
  /** where it appears */
  shot: string
  /** what it should depict — shown inside the frame */
  depicts: string
  /** CSS aspect-ratio value */
  aspect: string
  /** recommended pixel size */
  size: string
  /** fill this in: '/images/your-file.jpg' */
  src: string
  alt: string
}

export const IMAGE_SLOTS: Record<string, ImageSlot> = {
  poster1: {
    id: 'poster1',
    shot: 'SHOT 04 / poster 1 — MOSSORÓ',
    depicts: 'photo of Claudia as a young athlete in Mossoró, or the city itself',
    aspect: '12 / 16',
    size: '1200×1600',
    src: '',
    alt: 'Claudia Gadelha in Mossoró',
  },
  poster2: {
    id: 'poster2',
    shot: 'SHOT 04 / poster 2 — JUNGLE FIGHT',
    depicts: 'photo from a Jungle Fight bout or belt ceremony',
    aspect: '12 / 16',
    size: '1200×1600',
    src: '',
    alt: 'Claudia Gadelha at Jungle Fight',
  },
  poster3: {
    id: 'poster3',
    shot: 'SHOT 04 / poster 3 — INVICTA FC',
    depicts: 'photo from an Invicta FC bout',
    aspect: '12 / 16',
    size: '1200×1600',
    src: '',
    alt: 'Claudia Gadelha at Invicta FC',
  },
  poster4: {
    id: 'poster4',
    shot: 'SHOT 04 / poster 4 — UFC',
    depicts: 'photo from a UFC walkout or bout, rights cleared',
    aspect: '12 / 16',
    size: '1200×1600',
    src: '',
    alt: 'Claudia Gadelha in the UFC',
  },
  poster5: {
    id: 'poster5',
    shot: 'SHOT 04 / poster 5 — THE TITLE FIGHT',
    depicts: 'photo from the title fight vs. Joanna Jędrzejczyk, rights cleared',
    aspect: '12 / 16',
    size: '1200×1600',
    src: '',
    alt: 'Claudia Gadelha at the title fight',
  },
  poster6: {
    id: 'poster6',
    shot: 'SHOT 04 / poster 6 — THE NEXT CHAPTER',
    depicts: 'recent portrait of Claudia as executive and mentor',
    aspect: '12 / 16',
    size: '1200×1600',
    src: '',
    alt: 'Claudia Gadelha today',
  },
  ogImage: {
    id: 'ogImage',
    shot: 'Social share card (Open Graph / Twitter)',
    depicts: 'portrait or arena still with the wordmark; dark, gold accent',
    aspect: '1200 / 630',
    size: '1200×630',
    src: '/og.png',
    alt: 'Claudia Gadelha — The Walkout',
  },
}

export const TESTIMONIAL_SLOTS = 6
