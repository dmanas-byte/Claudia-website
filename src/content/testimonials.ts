/**
 * Member testimonials, copied verbatim from the owner's live site
 * (cgadelha.com "What Our Members Are Saying", Oct 2026). The owner keeps
 * permission records on file. Never add a testimonial that is not real.
 */
export interface Testimonial {
  quote: string
  initials: string
  name: string
  role: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Before MMC I had no idea what a covered call was. Now I run them every month on my portfolio. It changed how I think about money completely.',
    initials: 'DH',
    name: 'D. Harrison',
    role: 'FBI Special Agent',
  },
  {
    quote: 'Finally a clear path. Not another YouTube rabbit hole where you spend three hours and leave more confused than when you started.',
    initials: 'RP',
    name: 'R. Patel',
    role: 'Dentist',
  },
  {
    quote: 'I work in financial services and still learned things here I was never taught. The community accountability alone is worth it.',
    initials: 'TN',
    name: 'T. Nguyen',
    role: 'Financial Services Professional',
  },
  {
    quote: 'Claudia breaks it down in a way that actually sticks. No fluff. No jargon. Just the system and the people to hold you to it.',
    initials: 'MC',
    name: 'M. Castillo',
    role: 'Agency Owner',
  },
  {
    quote: 'Claudia’s program completely changed how I think about money. I always earned well but never knew how to make it work for me. Now I have real estate investments and a growing portfolio.',
    initials: 'MT',
    name: 'Marcus T.',
    role: 'Former NFL Player',
  },
  {
    quote: 'No fluff, no gimmicks. My relationship with money has completely transformed. I finally understand how to make my income work for me instead of the other way around.',
    initials: 'AC',
    name: 'Ana C.',
    role: 'Fitness Influencer',
  },
]
