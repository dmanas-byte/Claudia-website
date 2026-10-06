/** Socials as listed on the owner's live site (/links) plus the brief. */
export const SOCIALS = [
  { label: 'Instagram', handle: '@claudiagadelha', href: 'https://www.instagram.com/claudiagadelha/' },
  { label: 'YouTube', handle: '@Claudinhagadelha', href: 'https://www.youtube.com/@Claudinhagadelha' },
  { label: 'X', handle: '@claudiagadelha', href: 'https://x.com/claudiagadelha' },
  { label: 'TikTok', handle: '@claudinhagadelha', href: 'https://www.tiktok.com/@claudinhagadelha' },
  { label: 'Threads', handle: '@claudiagadelha', href: 'https://www.threads.net/@claudiagadelha' },
  { label: 'Facebook', handle: 'Claudinha Gadelha', href: 'https://www.facebook.com/ClaudinhaGadelha' },
] as const

export const SISTER_SITE = {
  label: 'Premium health coaching',
  href: 'https://gadelhaclaudia.com',
}

/** old funnel link; now lands on the application */
export const LEGACY_OPTIN_PATH = '/optin-1404'
export const LEGACY_OPTIN_TARGET = '/#apply'

export const PAGES = [
  { label: 'Speaking', href: '/speaking' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'Links', href: '/links' },
] as const
