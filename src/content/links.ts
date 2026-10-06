/**
 * cgadelha.com is Claudia's only website. Social profiles are exactly the ones
 * her own site links to (cgadelha.com/links). Do not add other sites or
 * profiles unless the owner confirms them.
 */
export const SOCIALS = [
  { label: 'Instagram', handle: '@claudiagadelha', href: 'https://www.instagram.com/claudiagadelha/' },
  { label: 'YouTube', handle: '@Claudinhagadelha', href: 'https://www.youtube.com/@Claudinhagadelha' },
  { label: 'X', handle: '@claudiagadelha', href: 'https://x.com/claudiagadelha' },
] as const

/** old funnel link; now lands on the application */
export const LEGACY_OPTIN_PATH = '/optin-1404'
export const LEGACY_OPTIN_TARGET = '/#apply'

export const PAGES = [
  { label: 'Speaking', href: '/speaking' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'Links', href: '/links' },
] as const
