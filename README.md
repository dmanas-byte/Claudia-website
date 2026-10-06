# Claudia Gadelha — The Walkout

A cinematic rebuild of [cgadelha.com](https://www.cgadelha.com): one continuous
WebGL camera move through a dark arena that becomes a city of light, with every
line of copy as real DOM text on top. Vite + React + TypeScript, three.js via
react-three-fiber, GSAP ScrollTrigger, Lenis. Static site, no backend.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # serve dist/ at http://localhost:4173
```

Copy `.env.example` to `.env` and set:

| variable                  | what it does                                                                 |
| ------------------------- | ---------------------------------------------------------------------------- |
| `VITE_FORM_ENDPOINT`      | URL both forms POST JSON to (Formspree, Basin, a Worker…). Empty = demo mode. |
| `VITE_SHOW_TESTIMONIALS`  | `false` hides the proof wall. Default on (testimonials come from the live site). |

Form payloads: `{ form: "apply" | "speaking", name, email, ..., page, ts }`.
To test locally: `npm run mock-endpoint` and set `VITE_FORM_ENDPOINT=http://localhost:8787/submit`.

## Deploy (under 15 minutes)

- **Vercel**: import the repo, framework "Vite", build `npm run build`, output `dist`. `vercel.json` already carries the SPA rewrite and the `/optin-1404 → /#apply` redirect.
- **Netlify**: same; `netlify.toml` is included.
- **GitHub Pages**: build, publish `dist/`; `public/404.html` routes deep links back to the app.

## Concept preview build

`npm run build:preview` builds a labelled preview into `dist-preview/`: a banner on
every screen says it is a concept preview and not the official site, the forms do
not send, assets use relative paths, and `page.html` is ready to host as a single
page. Use it to show the design before launch; deploy the normal build for the real site.

## Edit any line of copy

Everything a visitor reads lives in `src/content/`:

| file                | contents                                                                 |
| ------------------- | ------------------------------------------------------------------------ |
| `copy.ts`           | every headline, paragraph, button label, mono line, disclaimer, page copy |
| `facts.ts`          | career facts with `verified` flags and sources; the six timeline posters  |
| `testimonials.ts`   | the member quotes (verbatim from the live site)                           |
| `placeholders.ts`   | image slots (`src` per slot), community-proof images, placeholder tokens  |
| `links.ts`          | socials, sister site, secondary pages                                     |
| `shots.ts`          | the shot list: order, slate titles, anchors, scroll length per shot       |

Wrap one word in `*asterisks*` inside a headline to set it in the italic serif accent.

### Swap a photo

Open `src/content/placeholders.ts`, find the slot (for example `poster3`), drop the
file in `public/images/` and set `src: '/images/your-file.jpg'`. Empty `src` renders
the designed "owner to supply" frame. `ASSETS_NEEDED.md` lists every slot with size
and aspect ratio.

### Unknown values

Anything we could not confirm renders as a visible dashed token, e.g.
`[DAY/TIME — OWNER TO SUPPLY]`. They are all constants in `placeholders.ts`.

## Structure

```
src/
  content/     copy, facts, placeholders, links, shot list
  sections/    one DOM component per shot (SHOT 01–12) + Footer
  scene/       the WebGL set: Scene, CameraRig, cameraPath, Set, objects/, shaders/
  ui/          nav, belt, slate, letterbox, grain, flash, preloader, forms
  pages/       /speaking, /calculator, /links, /privacy, /terms
  store/       scroll store (progress → camera + uniforms) and settings
  fallback/    SVG set for browsers without WebGL
scripts/
  screenshot.ts      frames at every 10 % of scroll, desktop + mobile
  fetch-fonts.mjs    self-host Clash Display + Satoshi
  fetch-site-images.mjs  pull images from the live site into public/images
  mock-endpoint.mjs  local echo endpoint for the forms
```

See `ARCHITECTURE.md` for how scroll drives the camera and shaders.

## QA

```bash
npm run shots                                   # screenshots/ at 0,10,…100 %
npm run shots -- --query "motion=reduce"        # reduced-motion stills
npm run shots -- --query "nowebgl"              # SVG fallback
npm run shots -- --at 12,18 --viewport mobile   # specific frames
```

Query params for manual testing: `?nointro` (skip the cold open), `?nosmooth`
(native scroll), `?motion=reduce`, `?nowebgl`, `?lowpower`.

Fonts: Clash Display and Satoshi are self-hosted in `public/fonts` (ITF Free Font
License via Fontshare); JetBrains Mono and Instrument Serif come from fontsource.

## Measured (production build, Oct 2026)

| check                                   | result                                              |
| --------------------------------------- | --------------------------------------------------- |
| Lighthouse desktop                      | Accessibility 100 · Best practices 100 · SEO 100    |
| Largest contentful paint                | 1.7 s (hero type, fonts preloaded)                  |
| Cumulative layout shift                 | 0                                                   |
| First-load JS, gzipped, excluding three | ≈ 139 KB (three.js chunk ≈ 267 KB, loaded after first paint) |
| Page weight excluding below-the-fold photos | ≈ 2.2 MB                                        |
| WebGL draw calls per frame              | 36 – 59 across the twelve shots                     |

Lighthouse's performance score is not meaningful in a software-rendered
(SwiftShader) container; measure it on a real GPU.

## Accessibility and motion

- One `h1`, landmarks, labelled forms with live error messages, skip link, gold focus rings, canvas `aria-hidden`.
- `prefers-reduced-motion` or the footer toggle: no smooth scroll, no scrubbed animation, static stills per shot that cross-fade.
- No WebGL: an SVG arena-to-skyline set with the same type and layout.

## Legal

The disclaimer text in `copy.ts` (`DISCLAIMER`, `DISCLAIMER_LONG`) is marked
`[OWNER'S COUNSEL TO REVIEW WORDING]`. Privacy and Terms pages have headings and
`[OWNER TO SUPPLY]` bodies. All market data in the visuals is procedurally
generated and labelled "SAMPLE".
