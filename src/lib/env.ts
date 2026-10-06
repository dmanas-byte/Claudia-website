/** Build flags and helpers shared across the app. */

/** Concept-preview build (`npm run build:preview`): banner on, forms off, relative asset base. */
export const PREVIEW = import.meta.env.VITE_PREVIEW === 'true'

/** Resolve a file in public/ against the build's base ('/' in production, './' in the preview). */
export const asset = (path: string) => (path ? import.meta.env.BASE_URL + path.replace(/^\//, '') : path)

/** Relative base (preview hosting): routes travel as ?p=/path so relative assets keep resolving. */
const RELATIVE_BASE = import.meta.env.BASE_URL.startsWith('.')

/** Turn an internal href ('/', '/speaking', '/#apply') into a URL for history.pushState. */
export function routeUrl(href: string) {
  if (!RELATIVE_BASE) return href
  const here = window.location.pathname
  if (href === '/' || href === '') return here
  if (href.startsWith('/#')) return here + href.slice(1)
  return `${here}?p=${encodeURIComponent(href)}`
}
