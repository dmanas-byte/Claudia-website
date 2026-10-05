/**
 * Self-host Clash Display + Satoshi from Fontshare.
 * Downloads the woff2 files into public/fonts and writes src/styles/fonts.selfhosted.css.
 * Then: import './fonts.selfhosted.css' in src/styles/index.css and remove the Fontshare <link> in index.html.
 */
import { mkdirSync, writeFileSync } from 'node:fs'

const CSS_URL = 'https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=satoshi@400,500,700&display=swap'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'

const res = await fetch(CSS_URL, { headers: { 'User-Agent': UA } })
if (!res.ok) throw new Error(`Fontshare CSS ${res.status}`)
let css = await res.text()
mkdirSync('public/fonts', { recursive: true })
const urls = [...css.matchAll(/url\((https?:[^)]+\.woff2)\)/g)].map((m) => m[1])
let i = 0
for (const u of new Set(urls)) {
  const name = `font-${i++}-${u.split('/').pop().split('?')[0]}`
  const buf = Buffer.from(await (await fetch(u, { headers: { 'User-Agent': UA } })).arrayBuffer())
  writeFileSync(`public/fonts/${name}`, buf)
  css = css.split(u).join(`/fonts/${name}`)
  console.log('saved', name, buf.length, 'bytes')
}
// keep only woff2 sources
css = css.replace(/,\s*url\([^)]+\)\s*format\(['"](?!woff2)[^'"]+['"]\)/g, '')
writeFileSync('src/styles/fonts.selfhosted.css', css)
console.log('wrote src/styles/fonts.selfhosted.css')
