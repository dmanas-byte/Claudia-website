/**
 * Capture 1440×900 and 390×844 frames at 0, 10, 20 … 100 % of scroll.
 *
 *   npm run shots                       # against http://localhost:5173
 *   npm run shots -- --url http://localhost:4173 --out screenshots/prod
 *   npm run shots -- --qa-fonts path/to/qa-fonts.css   # stand-in @font-face when Fontshare is unreachable
 *   npm run shots -- --query "motion=reduce"   # extra query params (motion=reduce, nowebgl, lowpower)
 *   npm run shots -- --at 12,18,25 --viewport desktop   # only these scroll percentages / one viewport
 */
import { chromium, type Browser } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const opt = (name: string, def?: string) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? (args[i + 1] ?? def) : def
}
const has = (name: string) => args.includes(`--${name}`)

const URL = opt('url', 'http://localhost:5173')!
const OUT = opt('out', 'screenshots')!
const QUERY = opt('query', '')
/** --qa-fonts <path-to-css>: inject a stand-in @font-face stylesheet (used when Fontshare is unreachable) */
const QA_FONTS = opt('qa-fonts', '')
const STEPS = Number(opt('steps', '10'))
/** --at "12,18,25" capture only these percentages; --viewport desktop|mobile|both */
const AT = (opt('at', '') ?? '').split(',').map((v) => v.trim()).filter(Boolean).map(Number)
const VIEWPORT = opt('viewport', 'both')
const EXE = process.env.PW_CHROME || (process.env.CI ? undefined : undefined)

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
]

const QA_FONT_CSS = QA_FONTS ? readFileSync(QA_FONTS, 'utf8') : ''

async function run(browser: Browser) {
  for (const vp of VIEWPORTS.filter((v) => VIEWPORT === 'both' || v.name === VIEWPORT)) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
      userAgent: vp.mobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined,
    })
    await ctx.addInitScript(() => {
      try {
        sessionStorage.setItem('walkout:coldopen', '1')
      } catch {}
    })
    const page = await ctx.newPage()
    const errors: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push(String(e)))
    const q = ['nosmooth', 'nointro', QUERY].filter(Boolean).join('&')
    await page.goto(`${URL}/?${q}`, { waitUntil: 'networkidle' })
    if (QA_FONT_CSS) {
      await page.addStyleTag({ content: QA_FONT_CSS })
      await page.evaluate(() => document.fonts.ready)
    }
    await page.waitForTimeout(1200)
    const dir = join(OUT, vp.name)
    mkdirSync(dir, { recursive: true })
    const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
    const pcts = AT.length ? AT : Array.from({ length: STEPS + 1 }, (_, i) => Math.round((i / STEPS) * 100))
    for (const pct of pcts) {
      const y = Math.round((total * pct) / 100)
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'auto' }), y)
      await page.waitForTimeout(900)
      await page.screenshot({ path: join(dir, `${String(pct).padStart(3, '0')}.png`) })
      process.stdout.write(`${vp.name} ${pct}%  y=${y}\n`)
    }
    if (errors.length) {
      console.log(`\n[${vp.name}] console errors (${errors.length}):`)
      for (const e of [...new Set(errors)].slice(0, 15)) console.log('  ', e.slice(0, 220))
    } else console.log(`[${vp.name}] no console errors`)
    await ctx.close()
  }
}

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--hide-scrollbars'],
})
try {
  await run(browser)
} finally {
  await browser.close()
}
