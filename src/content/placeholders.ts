import { asset } from '../lib/env'

/**
 * Every unknown on the site lives here. Each constant is rendered visibly as
 * a labeled placeholder and listed in ASSETS_NEEDED.md. Swap one line to
 * replace it. Never replace a placeholder with an invented value.
 *
 * Photos come from the owner's live site (cgadelha.com) and live in
 * public/images/source/. Slots with an empty `src` render a designed frame.
 */
export const PLACEHOLDER_MEMBER_COUNT = '[MEMBER COUNT — OWNER TO SUPPLY]'
export const PLACEHOLDER_CALL_SCHEDULE = '[DAY/TIME — OWNER TO SUPPLY]'
export const PLACEHOLDER_ALERT_TIMESTAMP = '[SAMPLE]'
export const PLACEHOLDER_YEAR = '[YEAR]'
export const PLACEHOLDER_LEGAL_BODY = '[OWNER TO SUPPLY]'
export const PLACEHOLDER_DATE = '[DATE — VERIFY]'
/** leave empty to route "Contact" to the application form */
export const CONTACT_EMAIL = ''

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
  /** '/images/your-file.jpg' */
  src: string
  alt: string
  /** object-position for cover crops */
  focus?: string
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
    shot: 'SHOT 04 / poster 2 — NOVA UNIÃO',
    depicts: 'Claudia in the gi with her black belt',
    aspect: '12 / 16',
    size: '1200×1600',
    src: asset('/images/source/claudia-bjj.jpeg'),
    alt: 'Claudia Gadelha in a white gi wearing her black belt, in a gym with a chain-link fence',
    focus: '50% 20%',
  },
  poster3: {
    id: 'poster3',
    shot: 'SHOT 04 / poster 3 — INVICTA FC',
    depicts: 'photo from the Invicta FC 6 bout (13 Jul 2013), rights cleared',
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
    depicts: 'photo from the title fight vs. Joanna Jędrzejczyk (8 Jul 2016), rights cleared',
    aspect: '12 / 16',
    size: '1200×1600',
    src: '',
    alt: 'Claudia Gadelha at the title fight',
  },
  poster6: {
    id: 'poster6',
    shot: 'SHOT 04 / poster 6 — THE NEXT CHAPTER',
    depicts: 'Claudia on stage as executive and mentor',
    aspect: '12 / 16',
    size: '1200×1600',
    src: asset('/images/source/claudia-stage.jpeg'),
    alt: 'Claudia Gadelha speaking on stage with a headset microphone',
    focus: '50% 30%',
  },
  wallstreet: {
    id: 'wallstreet',
    shot: 'SHOT 06 / The Terminal — side panel',
    depicts: 'Claudia with the Charging Bull on Wall Street',
    aspect: '1092 / 1348',
    size: '1092×1348',
    src: asset('/images/source/wallstreet.jpeg'),
    alt: 'Claudia Gadelha smiling next to the Charging Bull statue on Wall Street',
  },
  speakingHero: {
    id: 'speakingHero',
    shot: 'Speaking page — hero',
    depicts: 'Claudia presenting at a podium',
    aspect: '1600 / 939',
    size: '1600×939',
    src: asset('/images/source/claudia-speaking.jpeg'),
    alt: 'Claudia Gadelha presenting on stage next to a laptop',
  },
  speaking1: {
    id: 'speaking1',
    shot: 'Speaking page — gallery 1',
    depicts: 'Claudia speaking at a lectern',
    aspect: '3 / 4',
    size: '960×1280',
    src: asset('/images/source/stage01.jpeg'),
    alt: 'Claudia Gadelha speaking at a lectern with a microphone',
  },
  speaking2: {
    id: 'speaking2',
    shot: 'Speaking page — gallery 2',
    depicts: 'Claudia on a panel',
    aspect: '16 / 10',
    size: '1600×1000',
    src: asset('/images/source/stage02.jpeg'),
    alt: 'Claudia Gadelha seated on stage during a panel discussion',
  },
  speaking3: {
    id: 'speaking3',
    shot: 'Speaking page — gallery 3',
    depicts: 'Claudia on stage, headset',
    aspect: '4 / 5',
    size: '1082×1354',
    src: asset('/images/source/claudia-stage.jpeg'),
    alt: 'Claudia Gadelha speaking on stage with a headset microphone',
  },
  ogImage: {
    id: 'ogImage',
    shot: 'Social share card (Open Graph / Twitter)',
    depicts: 'arena still with the headline; generated from the hero at build time',
    aspect: '1200 / 630',
    size: '1200×630',
    src: asset('/og.png'),
    alt: 'Claudia Gadelha — Financial Education Program',
  },
}

/** Community proof: member posts shared on the owner's site (SHOT 11). */
export const PROOF_IMAGES = [
  { src: asset('/images/source/depo3.jpeg'), alt: 'Community post from a member describing learning the wheel strategy during a rough market', w: 1320, h: 926 },
  { src: asset('/images/source/depo5.jpeg'), alt: 'Community post titled “Grateful for this community and the growth”', w: 1320, h: 1573 },
  { src: asset('/images/source/depo6.jpeg'), alt: 'Community post from a member', w: 1320, h: 611 },
  { src: asset('/images/source/depo7.jpeg'), alt: 'Community post from a member', w: 1300, h: 648 },
  { src: asset('/images/source/depo4.jpeg'), alt: 'Community post from a member', w: 1320, h: 369 },
  { src: asset('/images/source/depo2.jpeg'), alt: 'Community post from a member sharing what they learned with their daughter', w: 471, h: 1024 },
]

export const LOGO_SRC = asset('/images/source/logo.png')
