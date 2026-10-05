/**
 * Career facts. `verified` flips to true only once a reputable source has
 * been checked (see `source`). Unverified facts render a visible [VERIFY]
 * tag; verified ones carry data-verify="<source>" and show the tag only in
 * dev mode. Do not add facts beyond what the owner supplied.
 *
 * Verification pass (Oct 2026) against Sherdog, UFC.com, ESPN, Tapology:
 *  - Born 7 Dec 1988, Mossoró, RN, Brazil                       → verified
 *  - Pro debut 2008 (Force FC 1). NO Jungle Fight bout appears in her
 *    23-fight record on ESPN/Sherdog; "Jungle Fight" is owner-supplied and
 *    stays flagged until the owner confirms the promotion name.  → UNVERIFIED
 *  - Invicta FC 6, 13 Jul 2013, def. Ayaka Hamasaki (TKO R3)      → verified
 *  - UFC debut 16 Jul 2014 (UFC Fight Night 45), def. Tina Lähdemäki;
 *    the first women's strawweight bout in UFC history            → verified
 *  - vs. Joanna Jędrzejczyk: UFC on Fox 13, 13 Dec 2014 (L, SD) and the
 *    title fight at the TUF 23 Finale, 8 Jul 2016 (L, UD)         → verified
 *  - Last bout 7 Nov 2020 vs. Yan Xiaonan; retirement announced
 *    17 Dec 2021; final record 18–5                               → verified
 *  - Ranked No. 1 strawweight contender at points (UFC 212 billing) → verified
 *  - "4th-degree BJJ black belt": black belt under André Pederneiras
 *    (Nova União, 2010) is sourced; the degree is not            → UNVERIFIED
 *  - Law degree: "went to law school" sourced (UFC.com Q&A); graduation
 *    and university not sourced                                   → UNVERIFIED
 *  - UFC executive: Senior Director, Jiu-Jitsu Strategy & Business
 *    Development, UFC BJJ (UFC release, Jun 2025)                 → verified
 *  - "High-performance mentor": owner's own description of her work.
 */
export interface Fact {
  label: string
  value: string
  verified: boolean
  source?: string
  /** short note for the owner */
  note?: string
}

export const FIGHTER_FACTS: Fact[] = [
  { label: 'From', value: 'Mossoró, Brazil', verified: true, source: 'sherdog.com/fighter/Claudia-Gadelha-48404' },
  {
    label: 'Path',
    value: 'Jungle Fight → Invicta FC → UFC',
    verified: false,
    note: 'ESPN/Sherdog records show no Jungle Fight bout. Owner to confirm the promotion name or replace with “Brazilian circuit”.',
  },
  { label: 'Title fight', value: 'vs. Joanna Jędrzejczyk, 8 Jul 2016', verified: true, source: 'ufc.com/news/ultimate-fighter-finale-final-results-news' },
  { label: 'Ranking', value: 'Long-time top-ranked strawweight', verified: true, source: 'ufc.com/video/52379 (No. 1 vs No. 2, UFC 212)' },
  { label: 'Retired', value: 'Dec 2021 · 18–5', verified: true, source: 'sherdog.com/news/…Claudia-Gadelha-Announces-Retirement-183646' },
]

export const ARCHITECT_FACTS: Fact[] = [
  { label: 'Jiu-Jitsu', value: '4th-degree BJJ black belt', verified: false, note: 'Black belt (Nova União, 2010) is sourced; the degree is not.' },
  { label: 'Education', value: 'Law graduate', verified: false, note: 'Law school attendance sourced (UFC.com Q&A); graduation not.' },
  { label: 'Role', value: 'UFC executive', verified: true, source: 'ufc.com — Senior Director, Jiu-Jitsu Strategy & Business Development (Jun 2025)' },
  { label: 'Role', value: 'High-performance mentor', verified: true, source: 'owner copy' },
  { label: 'Now', value: 'Self-made wealth architect', verified: true, source: 'owner copy' },
]

export interface Poster {
  n: string
  title: string
  date: string
  dateVerified: boolean
  line: string
  slot: string
}

export const POSTERS: Poster[] = [
  { n: '01', title: 'Mossoró', date: 'Born 7 Dec 1988', dateVerified: true, line: 'Where it started. One bag, one plan.', slot: 'poster1' },
  {
    n: '02',
    title: 'Jungle Fight',
    date: 'Pro debut 2008 — promotion to confirm',
    dateVerified: false,
    line: 'Brazil’s proving ground. Seven years of regional fights.',
    slot: 'poster2',
  },
  { n: '03', title: 'Invicta FC', date: '13 Jul 2013', dateVerified: true, line: 'The world starts watching. Kansas City, round three.', slot: 'poster3' },
  { n: '04', title: 'UFC', date: '16 Jul 2014', dateVerified: true, line: 'The first women’s strawweight bout in UFC history.', slot: 'poster4' },
  { n: '05', title: 'The Title Fight', date: '8 Jul 2016', dateVerified: true, line: 'Five rounds for the strawweight championship.', slot: 'poster5' },
  { n: '06', title: 'The Next Chapter', date: 'Retired Dec 2021', dateVerified: true, line: 'Executive. Mentor. Architect.', slot: 'poster6' },
]

export const RECORD = { wins: 18, losses: 5, verified: true, source: 'sherdog.com/fighter/Claudia-Gadelha-48404' }
