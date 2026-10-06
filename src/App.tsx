import { lazy, Suspense, useEffect, useState } from 'react'
import { useSettings } from './store/useSettings'
import { getLenis, initScroll, scrollToAnchor } from './lib/scroll'
import { LEGACY_OPTIN_PATH, LEGACY_OPTIN_TARGET } from './content/links'
import { Nav } from './ui/Nav'
import { Belt } from './ui/Belt'
import { Slate } from './ui/Slate'
import { Letterbox } from './ui/Letterbox'
import { Grain } from './ui/Grain'
import { Preloader } from './ui/Preloader'
import { StickyCta } from './ui/StickyCta'
import { StaticScene } from './fallback/StaticScene'
import { Footer } from './sections/Footer'
import { Shot01Hero } from './sections/Shot01Hero'
import { Shot02Tape } from './sections/Shot02Tape'
import { Shot03Journey } from './sections/Shot03Journey'
import { Shot04Record } from './sections/Shot04Record'
import { Shot05Playbook } from './sections/Shot05Playbook'
import { Shot06Terminal } from './sections/Shot06Terminal'
import { Shot07Alert } from './sections/Shot07Alert'
import { Shot08Corner } from './sections/Shot08Corner'
import { Shot09Rig } from './sections/Shot09Rig'
import { Shot10Apply } from './sections/Shot10Apply'
import { Shot11Proof } from './sections/Shot11Proof'
import { Shot12Finale } from './sections/Shot12Finale'
import { LegalPage } from './pages/Legal'
import { SpeakingPage } from './pages/Speaking'
import { CalculatorPage } from './pages/Calculator'
import { LinksPage } from './pages/Links'
import './ui/chrome.css'
import { PREVIEW, routeUrl } from './lib/env'
import { PreviewBanner } from './ui/PreviewBanner'

const Scene = lazy(() => import('./scene/Scene'))

type Route = 'home' | 'privacy' | 'terms' | 'speaking' | 'calculator' | 'links'

function resolveRoute(pathname: string): Route {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/privacy') return 'privacy'
  if (p === '/terms') return 'terms'
  if (p === '/speaking') return 'speaking'
  if (p === '/calculator') return 'calculator'
  if (p === '/links') return 'links'
  // ?p=/path: GitHub Pages 404 fallback and the relative-base preview build
  const q = new URLSearchParams(window.location.search).get('p')
  if (q && q !== pathname) return resolveRoute(q)
  return 'home'
}

/** `?motion=reduce`, `?nosmooth`, `?nointro`, `?nowebgl` for QA runs */
function applyQueryOverrides() {
  const q = new URLSearchParams(window.location.search)
  if (q.get('motion') === 'reduce') useSettings.setState({ reducedMotion: true })
  if (q.has('nowebgl')) useSettings.setState({ webgl: false })
  if (q.has('nointro')) useSettings.setState({ introDone: true, preloaderDone: true })
  if (q.has('lowpower')) useSettings.setState({ lowPower: true })
  document.documentElement.dataset.motion = useSettings.getState().reducedMotion ? 'reduce' : 'full'
  document.documentElement.dataset.webgl = useSettings.getState().webgl ? 'on' : 'off'
  return { nosmooth: q.has('nosmooth') }
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => resolveRoute(window.location.pathname))

  useEffect(() => {
    const onPop = () => {
      setRoute(resolveRoute(window.location.pathname))
      // new page, new height: let smooth scroll and the shot map catch up
      requestAnimationFrame(() => requestAnimationFrame(() => getLenis()?.resize()))
    }
    window.addEventListener('popstate', onPop)
    // intercept same-origin internal links (legal pages) without a router lib
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      const a = (e.target as HTMLElement).closest?.('a[data-route]') as HTMLAnchorElement | null
      if (!a || e.metaKey || e.ctrlKey || e.button !== 0) return
      e.preventDefault()
      const href = a.getAttribute('href') ?? '/'
      window.history.pushState({}, '', routeUrl(href))
      if (!href.includes('#')) window.scrollTo(0, 0)
      onPop()
    }
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])

  const page =
    route === 'privacy' || route === 'terms' ? (
      <LegalPage kind={route} />
    ) : route === 'speaking' ? (
      <SpeakingPage />
    ) : route === 'calculator' ? (
      <CalculatorPage />
    ) : route === 'links' ? (
      <LinksPage />
    ) : (
      <Home />
    )
  return (
    <>
      {PREVIEW && <PreviewBanner />}
      {page}
    </>
  )
}

function Home() {
  const webgl = useSettings((s) => s.webgl)
  // mount the WebGL chunk after first paint so the hero type is the LCP
  const [sceneReady, setSceneReady] = useState(false)
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    const go = () => setSceneReady(true)
    if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 900 })
    else window.setTimeout(go, 250)
  }, [])
  const reduced = useSettings((s) => s.reducedMotion)
  const introDone = useSettings((s) => s.introDone)
  const preloaderDone = useSettings((s) => s.preloaderDone)

  useEffect(() => {
    const { nosmooth } = applyQueryOverrides()
    const st = useSettings.getState()
    initScroll({ smooth: !st.reducedMotion && !nosmooth && !st.touch })

    // legacy funnel link keeps working: /optin-1404 → /#apply
    const legacy = window.location.pathname.startsWith(LEGACY_OPTIN_PATH)
    if (legacy) {
      window.history.replaceState({}, '', LEGACY_OPTIN_TARGET)
      useSettings.setState({ introDone: true, preloaderDone: true })
    }
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      // wait for layout
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToAnchor(hash, { immediate: true })))
    }
    // expose a tiny QA hook for the screenshot script
    ;(window as unknown as { __walkout: unknown }).__walkout = {
      scrollTo: (y: number) => window.scrollTo({ top: y, behavior: 'auto' }),
    }
  }, [])

  const showPreloader = !introDone && !preloaderDone && !reduced

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {webgl ? (
        sceneReady && (
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        )
      ) : (
        <StaticScene />
      )}
      <Nav />
      <main id="main">
        <Shot01Hero />
        <Shot02Tape />
        <Shot03Journey />
        <Shot04Record />
        <Shot05Playbook />
        <Shot06Terminal />
        <Shot07Alert />
        <Shot08Corner />
        <Shot09Rig />
        <Shot10Apply />
        <Shot11Proof />
        <Shot12Finale />
      </main>
      <Footer />
      <Letterbox />
      <Belt />
      <Slate />
      <StickyCta />
      <Grain />
      {showPreloader && <Preloader />}
    </>
  )
}
