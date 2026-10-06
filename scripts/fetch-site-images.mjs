/**
 * Pull every image from the current cgadelha.com pages into public/images/source/
 * and write public/images/source/manifest.json (url, file, alt, page, size).
 * Needs network access to www.cgadelha.com and its image host.
 *
 *   node scripts/fetch-site-images.mjs            # homepage + /optin-1404
 *   node scripts/fetch-site-images.mjs https://www.cgadelha.com/some-page
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : ['https://www.cgadelha.com/', 'https://www.cgadelha.com/optin-1404']
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
const OUT = 'public/images/source'
mkdirSync(OUT, { recursive: true })

const seen = new Map()
for (const page of PAGES) {
  const res = await fetch(page, { headers: { 'User-Agent': UA } })
  if (!res.ok) {
    console.error('skip', page, res.status)
    continue
  }
  const html = await res.text()
  const base = new URL(page)
  const found = new Set()
  for (const m of html.matchAll(/(?:src|data-src|href|content)=["']([^"']+\.(?:jpe?g|png|webp|avif|gif|svg)(?:\?[^"']*)?)["']/gi)) found.add(m[1])
  for (const m of html.matchAll(/url\(["']?([^"')]+\.(?:jpe?g|png|webp|avif|gif))["']?\)/gi)) found.add(m[1])
  for (const m of html.matchAll(/srcset=["']([^"']+)["']/gi)) for (const part of m[1].split(',')) found.add(part.trim().split(/\s+/)[0])
  for (const raw of found) {
    let url
    try {
      url = new URL(raw, base).href
    } catch {
      continue
    }
    if (seen.has(url)) continue
    const alt = (html.match(new RegExp(`<img[^>]+${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*alt=["']([^"']*)["']`, 'i')) || [])[1] ?? ''
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Referer: page } })
      if (!r.ok) continue
      const buf = Buffer.from(await r.arrayBuffer())
      if (buf.length < 2000) continue // icons / tracking pixels
      const ext = (url.split('?')[0].match(/\.(jpe?g|png|webp|avif|gif|svg)$/i) || ['', 'bin'])[1].toLowerCase()
      const file = `${createHash('sha1').update(url).digest('hex').slice(0, 10)}.${ext}`
      writeFileSync(`${OUT}/${file}`, buf)
      seen.set(url, { url, file: `/images/source/${file}`, alt, page, bytes: buf.length })
      console.log('saved', file, buf.length, 'bytes', alt ? `alt="${alt}"` : '')
    } catch (e) {
      console.error('failed', url, e.message)
    }
  }
}
writeFileSync(`${OUT}/manifest.json`, JSON.stringify([...seen.values()], null, 2))
console.log(`\n${seen.size} images → ${OUT}/manifest.json. Map them to slots in src/content/placeholders.ts.`)
