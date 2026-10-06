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
  { label: 'Start', value: 'Hitchhiked 4 hours to her first BJJ gym at 15', verified: true, source: 'owner site (cgadelha.com)' },
  { label: 'Camp', value: 'Trained with José Aldo and Renan Barão', verified: true, source: 'owner site; Nova União black belt 2010 (graciemag.com)' },
  { label: 'Title fight', value: 'vs. Joanna Jędrzejczyk, 8 Jul 2016', verified: true, source: 'ufc.com/news/ultimate-fighter-finale-final-results-news' },
  { label: 'Retired', value: 'Dec 2021 · 18–5', verified: true, source: 'sherdog.com/news/…Claudia-Gadelha-Announces-Retirement-183646' },
]

export const ARCHITECT_FACTS: Fact[] = [
  { label: '8-Fig', value: '8-figure investor', verified: true, source: 'owner site (cgadelha.com)' },
  { label: 'Options', value: 'Growth investor and options trader', verified: true, source: 'owner site (cgadelha.com)' },
  { label: 'BJJ', value: '4th-degree BJJ black belt', verified: true, source: 'owner site (cgadelha.com); black belt under André Pederneiras, 2010' },
  { label: 'Exec', value: 'UFC executive', verified: true, source: 'ufc.com — Senior Director, Jiu-Jitsu Strategy & Business Development (Jun 2025)' },
  { label: 'Law', value: 'Law graduate', verified: true, source: 'owner site (cgadelha.com); law school attendance also on ufc.com Q&A' },
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
  { n: '01', title: 'Mossoró', date: 'Born 7 Dec 1988', dateVerified: true, line: 'A dream, a backpack, and a highway.', slot: 'poster1' },
  { n: '02', title: 'Nova União', date: 'Black belt 2010', dateVerified: true, line: 'Training with José Aldo and Renan Barão.', slot: 'poster2' },
  { n: '03', title: 'Invicta FC', date: '13 Jul 2013', dateVerified: true, line: 'The world starts watching. Kansas City, round three.', slot: 'poster3' },
  { n: '04', title: 'UFC', date: '16 Jul 2014', dateVerified: true, line: 'The first women’s strawweight bout in UFC history.', slot: 'poster4' },
  { n: '05', title: 'The Title Fight', date: '8 Jul 2016', dateVerified: true, line: 'Five rounds for the strawweight championship.', slot: 'poster5' },
  { n: '06', title: 'The Next Chapter', date: 'Retired Dec 2021', dateVerified: true, line: 'Executive. Investor. Mentor.', slot: 'poster6' },
]

export const RECORD = { wins: 18, losses: 5, verified: true, source: 'sherdog.com/fighter/Claudia-Gadelha-48404' }
