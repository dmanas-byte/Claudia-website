/**
 * Every line of copy on the site. Edit here; nothing is hard-coded in components.
 * Words wrapped in *asterisks* render in the italic serif accent (one per headline).
 *
 * Source of truth: the owner's live site (cgadelha.com, read Oct 2026). Lines
 * marked "owner copy" are quoted from it; the rest is editorial framing.
 */
export const BRAND = {
  wordmark: 'Claudia Gadelha',
  tagline: 'Financial Education Program',
  siteTitle: 'Claudia Gadelha’s Financial Education Program',
  description:
    'Your money should work harder than you do. Claudia Gadelha’s Financial Education Program: weekly live calls, her real portfolio and trade alerts by text, options training and signals, and access to her network. Apply to work with Claudia.',
  credentials: 'UFC Executive · 8-Figure Investor · 4th Degree BJJ Black Belt', // owner copy
}

export const NAV = {
  program: 'The Program',
  story: 'Her Story',
  speaking: 'Speaking',
  calculator: 'Calculator',
  cta: 'Apply to Work With Me', // owner copy
  ctaShort: 'Apply',
}

export const CTA = {
  apply: 'Apply to Work With Me', // owner copy
  applyShort: 'Apply to Work With Me',
  program: 'See what’s inside',
  bookCall: 'Book a free call', // owner copy: "Book a free call with one of our coaches to get started."
}

export const PRELOADER = {
  rounds: ['ROUND 1', 'ROUND 2', 'ROUND 3'],
  skip: 'Skip',
}

export const HERO = {
  kicker: 'Claudia Gadelha’s Financial Education Program',
  lines: ['Your money should', 'work *harder*', 'than you do.'], // owner copy
  offer:
    'You already have the income. You are missing the system. Weekly live calls, Claudia’s real portfolio and every trade alert by text, options training and signals, and her network of lawyers, tax strategists and real-estate deals.',
  pillars: ['6-Week Options Course', 'Live Weekly Community Calls', 'Real Portfolio Training'], // owner copy
}

export const TAPE = {
  kicker: 'Tale of the tape',
  name: 'Claudia “Claudinha” Gadelha',
  left: 'In the cage',
  right: 'Out of the cage',
}

/** SHOT 03 — her journey in three beats; each beat has its own picture in the scene. */
export const JOURNEY = {
  kicker: 'Her journey',
  beats: [
    {
      line: 'From a girl with a backpack.',
      body: 'At 15, Claudia stood on the side of a highway in Brazil with nothing but a dream and a backpack. She hitchhiked four hours to the closest Jiu-Jitsu gym she could find, slept on the floor and sold sandwiches on the beach to survive.',
    },
    {
      line: 'To a UFC fighter.',
      body: 'That drive took her to Nova União, training with José Aldo and Renan Barão, and into the UFC as one of the best strawweights in the world. In 2016 she fought Joanna Jędrzejczyk for the title.',
    },
    {
      line: 'To a self-made *wealth* architect.',
      body: 'While most athletes are broke within two years of retirement, Claudia studied money, invested in real estate and learned the stock market. Today she is a UFC executive, and she teaches that system in the Financial Education Program.',
    },
  ],
  statNote: 'Owner’s site cites “78% of athletes are broke 2 years after retirement”. Source to be added before publishing the figure.',
}

export const RECORD = {
  kicker: 'Her story',
  headline: 'The *record*.',
  hint: 'Scroll to move through the timeline',
}

export const PLAYBOOK = {
  kicker: 'What is inside',
  headline: 'Everything you need. Nothing you *do not*.', // owner copy
  rounds: [
    {
      n: 1,
      name: 'Portfolio Playbook',
      headline: 'Her real portfolio. Tickers, shares, numbers.',
      body: 'The yearly stock and crypto portfolio playbook: Claudia’s full annual thesis on where to put your money and why, plus her long-term conviction positions for 3, 5 and 10 years.',
      get: 'WHAT YOU GET — 02 YEARLY PORTFOLIO PLAYBOOK · 07 LONG-TERM INVESTMENT THESIS',
    },
    {
      n: 2,
      name: 'Real-Time Trade Alerts',
      headline: 'Every order she places, you get the text.',
      body: 'Text alerts every time Claudia places an order, with full portfolio access: numbers, tickers and shares. You watch the decision happen, not the highlight reel.',
      get: 'WHAT YOU GET — 03 REAL-TIME TRADE ALERTS · FULL PORTFOLIO ACCESS',
    },
    {
      n: 3,
      name: 'Options & Signals',
      headline: 'Six weeks to your first options strategy.',
      body: 'Options training from zero to executing your first strategy in a live brokerage account, then options signals and swing-trade signals based on Claudia’s own trades, explained in plain language with entry, target and risk.',
      get: 'WHAT YOU GET — 04 OPTIONS TRAINING · 05 OPTIONS SIGNALS · 06 SWING TRADE SIGNALS',
    },
    {
      n: 4,
      name: 'Live Weekly Calls',
      headline: 'The corner. Every single week.',
      body: 'Education, Q&A, strategy review and accountability every week, plus guest sessions with top investors, traders, lawyers and strategists, and the mindset training of elite sport applied to your money.',
      get: 'WHAT YOU GET — 01 WEEKLY LIVE CALLS · 08 MINDSET TRAINING · 09 GUEST EXPERT SESSIONS',
    },
    {
      n: 5,
      name: 'Airbnb Portfolio',
      headline: 'Short-term rentals, long-term thinking.',
      body: 'Inside Claudia’s Airbnb portfolio: exactly how she generates passive income through short-term rentals, how properties are chosen, set up and run.',
      get: 'WHAT YOU GET — 14 ACCESS TO CLAUDIA’S AIRBNB PORTFOLIO',
    },
    {
      n: 6,
      name: 'The Network',
      headline: 'Deals, lawyers, tax, insurance.',
      body: 'Curated real-estate deals and partnerships from Claudia’s own network, plus access to lawyers for your trust, insurance agents and tax strategists, so what you build is protected and kept.',
      get: 'WHAT YOU GET — 13 REAL ESTATE OPPORTUNITIES · 10 LAWYERS · 11 INSURANCE · 12 TAX STRATEGISTS',
    },
  ],
}

/** The full 14-item list, owner copy, shown in the Apply section. */
export const INSIDE = [
  { n: '01', t: 'Weekly live calls', d: 'Education, Q&A, strategy review, and accountability, every single week.' },
  { n: '02', t: 'Yearly stock and crypto portfolio playbook', d: 'Claudia’s full annual thesis on where to put your money and why.' },
  { n: '03', t: 'Real-time trade alerts', d: 'Text alerts every time Claudia places an order, with full portfolio access, numbers, tickers, and shares.' },
  { n: '04', t: 'Options training', d: 'From zero to executing your first strategy in a live brokerage account.' },
  { n: '05', t: 'Options signals', d: 'Actionable signals based on Claudia’s own trades, explained in plain language.' },
  { n: '06', t: 'Swing trade signals', d: 'Short to medium-term trade ideas with clear entry, target, and risk levels.' },
  { n: '07', t: 'Long-term investment thesis', d: 'Claudia’s conviction positions for wealth building over 3, 5, and 10 years.' },
  { n: '08', t: 'High performance and mindset training', d: 'The mental frameworks from elite sport applied directly to your financial life.' },
  { n: '09', t: 'Guest expert sessions', d: 'Access to top investors, traders, lawyers, and strategists, live and recorded.' },
  { n: '10', t: 'Access to lawyers for your trust', d: 'Set up the right legal structures to protect and pass on your wealth.' },
  { n: '11', t: 'Access to insurance agents', d: 'Protect what you build with the right coverage, properly structured.' },
  { n: '12', t: 'Access to tax strategists', d: 'Keep more of what you earn with strategies most high earners never hear about.' },
  { n: '13', t: 'Access to real estate opportunities', d: 'Curated deals and partnerships from Claudia’s own network.' },
  { n: '14', t: 'Access to Claudia’s Airbnb portfolio', d: 'Learn exactly how she generates passive income through short-term rentals.' },
]

export const TERMINAL = {
  kicker: 'The real problem', // owner copy
  headline: 'You are great at *earning*. Nobody taught you the rest.', // owner copy
  body: 'Most high earners are stuck in the same trap. Strong income. No clear system. Money sitting idle while time keeps moving. This is not a discipline problem. This is a knowledge gap, and knowledge gaps close fast when you have the right people around you.', // owner copy
  lines: [
    'YOU EARN WELL BUT HAVE NOTHING TO SHOW FOR IT AT THE END OF THE MONTH',
    'COVERED CALLS, OPTIONS, PORTFOLIO INCOME — IT SOUNDS LIKE ANOTHER LANGUAGE',
    'YOU KEEP SAYING YOU WILL FIGURE IT OUT LATER. LATER NEVER COMES.',
    'YOU WANT FINANCIAL EDUCATION BUT HAVE NO IDEA WHERE TO START',
  ], // owner copy, set in mono
  wallLabel: 'SAMPLE DATA — ILLUSTRATIVE ONLY — NOT REAL PERFORMANCE',
  photoCaption: 'WALL STREET — 8-FIGURE INVESTOR',
}

export const ALERT = {
  kicker: 'Real-time trade alerts',
  sender: 'CLAUDIA',
  message: 'Just placed an order. Details inside.',
  headline: 'You don’t learn by watching highlights. You learn in *real* time.',
  body: 'Text alerts every time Claudia places an order, with full portfolio access, numbers, tickers, and shares.', // owner copy
}

export const CORNER = {
  kicker: 'The framework', // owner copy
  headline: 'One word. Nine *principles*. One destination.', // owner copy
  body: 'Liberdade is the Portuguese word for freedom. It is my first language. It is where I come from. I brought it here on purpose, because what I am teaching is not just a financial system. It is the same mindset that took me from a small city in Brazil to fighting on the biggest stage in combat sports. Now I am using it to help you build the life you actually want.', // owner copy
  word: 'LIBERDADE',
  principles: [
    { pt: 'Liderar', en: 'Lead', d: 'You are in charge of your financial life. Nobody else.' },
    { pt: 'Intensidade', en: 'Intensity', d: 'Live fully. A half-committed life builds half results.' },
    { pt: 'Base', en: 'Foundation', d: 'Solid planning before any move. No shortcuts here.' },
    { pt: 'Estratégia', en: 'Strategy', d: 'Consistent, intentional action over time. Every time.' },
    { pt: 'Ritmo', en: 'Rhythm', d: 'Build momentum. Show up daily. Trust the compounding.' },
    { pt: 'Disciplina', en: 'Discipline', d: 'Consistency when it is easy. Resilience when it is not.' },
    { pt: 'Assertividade', en: 'Assertion', d: 'Make bold decisions. Inaction is the most expensive habit.' },
    { pt: 'Decisão', en: 'Decision', d: 'Every dollar has a purpose. Every move has an intention.' },
    { pt: 'Expansão', en: 'Expansion', d: 'You are not here to maintain. You are here to grow.' },
  ], // owner copy
  schedule: 'LIVE CALLS — WEEKLY —',
}

export const RIG = {
  kicker: 'Is this for me?', // owner copy
  headline: 'This is for you if you are *done* waiting.', // owner copy
  body: 'This is not for people looking for shortcuts. MMC is for people who are willing to do the work and want the right system to follow.', // owner copy ("MMC" as on the live site)
  personas: [
    { t: 'The Earner With No System', d: 'You are between 26 and 40, earning well, but not building wealth. The income is there. The plan is not.' },
    { t: 'The Skilled Professional', d: 'You are a dentist, agency owner, or financial services employee who wants advanced money skills without the jargon.' },
    { t: 'The Disciplined Athlete or Entrepreneur', d: 'You already understand what commitment looks like. You want to apply that same mindset to your finances.' },
    { t: 'The Beginner Ready to Start', d: 'You want a clear, structured path and real people to learn alongside, no prior experience needed.' },
  ], // owner copy
  count: 'rig',
}

export const APPLY = {
  kicker: 'Your next move', // owner copy
  headline: 'Are you ready for your financial *education*?', // owner copy
  body: 'Freedom is not a feeling you stumble into. It is a decision you make and then build on every single day. The community is where that building happens.', // owner copy
  urgency: 'Every week you wait is a live call you miss.', // owner copy
  formTitle: 'Book a free call with one of our coaches to get started.', // owner copy
  insideTitle: 'What is inside — 14 items',
  name: 'Name',
  email: 'Email',
  phone: 'Phone (optional)',
  question: 'In one line, what do you want to build?',
  submit: 'Apply to Work With Me',
  consent: 'By applying you agree to be contacted by Claudia Gadelha’s team about your application and the program. See our',
  privacy: 'Privacy Policy',
  and: 'and',
  terms: 'Terms',
  success: 'Application received. Claudia’s team will be in touch to book your call.',
  error: 'That didn’t go through. Please try again.',
  demoNote: 'Form endpoint not configured (VITE_FORM_ENDPOINT). Submission logged to console.',
}

export const PROOF = {
  kicker: 'Testimonials',
  headline: 'What our members are *saying*.', // owner copy
  communityKicker: 'Community proof',
  communityHeadline: 'Real people. Real results.', // owner copy
  communityNote: 'Posts from the member community, shared on the owner’s site.',
}

export const FINALE = {
  headline: 'Your *walkout* starts here.',
  quote: '“A good coach can change your game. A great coach can change your life.”', // owner copy
}

export const FOOTER = {
  socials: 'Follow',
  legal: 'Legal',
  pages: 'More',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  contact: 'Contact',
  reduceMotion: 'Reduce motion',
  copyright: '© Claudia Gadelha Financial Education Program. All rights reserved.', // owner copy
}

/**
 * [OWNER'S COUNSEL TO REVIEW WORDING] — text must stay visible regardless.
 * Verbatim from the owner's live site footer.
 */
export const DISCLAIMER =
  'For educational purposes only. This is not financial advice, investment advice, or a recommendation or solicitation to buy or sell any security. All investing involves risk, including the potential loss of principal. Past performance is not indicative of future results.'

export const DISCLAIMER_LONG = [
  DISCLAIMER,
  'Claudia Gadelha is not a registered investment adviser, broker-dealer or financial planner. Trade alerts and signals describe orders Claudia places in her own accounts and are shared for educational purposes; they are not recommendations to buy or sell any security. Member testimonials reflect individual experiences and are not a guarantee of results. All sample market data shown in the visuals on this site is procedurally generated and illustrative only.',
  'Nothing on this site constitutes an offer to sell or a solicitation of an offer to buy any security or real-estate interest. Consult a licensed professional before making financial decisions.',
]

/* ── secondary pages (ported from the live site) ───────────────────────── */
export const SPEAKING = {
  kicker: 'Speaking and seminars',
  headline: 'Bring Claudia to *your* stage.',
  body: 'UFC fighter. 8-figure investor. UFC executive. Claudia brings a rare combination of elite athletic discipline and real-world financial mastery to every stage she steps on.',
  cta: 'Book Claudia',
  creds: ['UFC Fighter and Executive', '4th Degree BJJ Black Belt', '8-Figure Investor', 'Options Trader and Portfolio Manager', 'Law Graduate', 'Keynote Speaker and Mentor'],
  topicsKicker: 'Speaking topics',
  topicsHeadline: 'What Claudia speaks about.',
  topics: [
    { t: 'From Fight Money to Freedom Money', d: 'How Claudia went from a professional athlete to an 8-figure investor, and the financial system behind it.' },
    { t: 'The High-Performer Money Mindset', d: 'The mental frameworks elite athletes use, applied to building and protecting personal wealth.' },
    { t: 'Building Wealth While at the Top', d: 'How to create financial systems that work even when your career demands 100% of your focus.' },
    { t: 'Leadership, Discipline and Financial Education', d: 'The connection between high performance in sport, business, and personal finance.' },
  ],
  whyKicker: 'Why Claudia',
  whyHeadline: 'A story your audience will never forget.',
  why: [
    'Claudia Gadelha is not a motivational speaker with theory. She is someone who lived it, from hitchhiking at 15 to reach her first BJJ gym, to becoming one of the best female fighters in UFC history.',
    'While most professional athletes go broke after retirement, Claudia built an 8-figure portfolio and became a UFC executive. Her story is about discipline, strategy, and the decision to play a bigger game.',
    'Whether your audience is made up of athletes, executives, entrepreneurs, or students, Claudia meets them where they are and leaves them with tools they can use the same day.',
  ],
  formatsKicker: 'Formats',
  formatsHeadline: 'How we can work together.',
  formats: [
    { t: 'Keynote', d: '45 to 90-minute keynote presentation for conferences, corporate events, and summits.' },
    { t: 'Seminar', d: 'In-depth seminars on financial education, wealth building, and high-performance mindset.' },
    { t: 'Workshop', d: 'Half or full-day hands-on workshop focused on financial strategy and mindset.' },
    { t: 'Panel', d: 'Moderated or open panel discussions on wealth, performance, and entrepreneurship.' },
    { t: 'Private Event', d: 'Exclusive sessions for executive teams, athlete groups, or high-net-worth communities.' },
  ],
  quote: '“Claudia does not just inspire, she gives you a system. Our team left with a completely different relationship with money and performance.”',
  quoteBy: 'Event Organizer, Corporate Leadership Summit',
  bookKicker: 'Ready to book?',
  bookHeadline: 'Let’s bring this to *your* event.',
  bookBody: 'Fill out the inquiry form and our team will get back to you within 48 hours to discuss availability, format, and fit.',
  submit: 'Submit Your Inquiry',
  respond: 'We respond within 48 hours.',
  fields: { name: 'Name', email: 'Email', org: 'Organization', event: 'Event, date and format', message: 'Tell us about your audience' },
  success: 'Inquiry received. We respond within 48 hours.',
}

export const CALCULATOR = {
  kicker: 'Financial education tool',
  headline: 'Your freedom *number*.',
  body: 'Find out exactly how much you need invested to never work again, based on the 4% rule.',
  label: 'How much monthly income would you need to live financially free?',
  submit: 'Calculate my freedom number',
  resultLabel: 'Your freedom number',
  resultSub: 'Invested at a 4% withdrawal rate, this generates your monthly income.',
  method: 'THE 4% RULE — MONTHLY INCOME × 12 ÷ 0.04. A RULE OF THUMB, NOT A PLAN.',
  nextKicker: 'Ready to get there?',
  nextHeadline: 'Now learn how to actually *build* that number.',
  nextBody: 'Join Claudia Gadelha’s community and get the strategies, signals, and support to make it real.',
}

export const LINKS = {
  name: 'Claudia Gadelha',
  creds: BRAND.credentials,
  tagline: 'From Fight Money to Freedom Money',
  items: [
    { t: 'Financial Education Program', d: 'Learn how Claudia built wealth, and how you can too', href: '/' },
    { t: 'Free Ebook, Money Moves', d: 'Download Claudia’s financial blueprint', href: '', placeholder: 'EBOOK LINK — OWNER TO SUPPLY' },
    { t: 'Financial Education Calculator', d: 'Find out your freedom number', href: '/calculator' },
    { t: 'YouTube Channel', d: 'Financial tips & strategies', href: 'https://www.youtube.com/@Claudinhagadelha' },
    { t: 'Stay at my Orlando Airbnb', d: '5BR vacation home with heated pool', href: '', placeholder: 'AIRBNB LINK — OWNER TO SUPPLY' },
    { t: 'Apply to Work With Me', d: 'The Financial Education Program', href: '/#apply' },
  ],
  quote: '“A good coach can change your game. A great coach can change your life.”',
}
