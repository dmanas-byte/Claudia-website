/**
 * Turn dist-preview/index.html into page.html for hosting as a single page whose
 * host supplies <!doctype>, <html>, <head> and <body>: keeps the title first,
 * adds noindex, and moves head links/scripts into the body.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('dist-preview/index.html', 'utf8')
const head = (src.match(/<head>([\s\S]*?)<\/head>/) || [])[1] ?? ''
const body = (src.match(/<body>([\s\S]*?)<\/body>/) || [])[1] ?? ''
const keep = head
  .split('\n')
  .filter((l) => !/<meta charset|<meta name="viewport"|<title>|og:|twitter:|<meta name="description"/.test(l))
  .join('\n')
const page = `<title>Claudia Gadelha Redesign</title>
<meta name="robots" content="noindex, nofollow" />
${keep.trim()}
${body.trim()}
`
writeFileSync('dist-preview/page.html', page)
console.log('wrote dist-preview/page.html', page.length, 'bytes')
