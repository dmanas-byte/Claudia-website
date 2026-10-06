# Claudia Gadelha — The Walkout

A cinematic rebuild of [cgadelha.com](https://www.cgadelha.com): her story told
as a film you scroll through, one Higgsfield-generated picture per beat, with
every line of copy as real DOM text on top. Vite + React + TypeScript, GSAP,
Lenis. Static site, no backend.

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
| `links.ts`          | socials (only those cgadelha.com links to) and secondary pages            |
| `shots.ts`          | the shot list: order, slate titles, anchors, scroll length per shot       |
| `film.ts`           | the scroll pictures: which plate shows where, and why                     |

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
  film/        the scroll pictures layer (crossfading Higgsfield plates)
  ui/          nav, belt, slate, letterbox, grain, flash, preloader, forms
  pages/       /speaking, /calculator, /links, /privacy, /terms
  store/       scroll store (progress → camera + uniforms) and settings
scripts/
  screenshot.ts      frames at every 10 % of scroll, desktop + mobile
  fetch-fonts.mjs    self-host Clash Display + Satoshi
  fetch-site-images.mjs  pull images from the live site into public/images
  process-art.mjs    raw Higgsfield renders in art/ → public/film (WebP + MP4)
  mock-endpoint.mjs  local echo endpoint for the forms
```

See `ARCHITECTURE.md` for how scroll drives the pictures.

### Swap a scroll picture

Each beat's picture is `public/film/<id>-1920.webp` and `-1080.webp` (plus
`<id>.mp4` and `-720.mp4` for the hero, the backpack, the trading floor and the
finale). Replace the files with the same names, or put a new render in `art/raw/`,
point `scripts/process-art.mjs` at it and run `node scripts/process-art.mjs`.
`src/content/film.ts` says what each picture shows and why it is there.

## QA

```bash
npm run shots                                   # screenshots/ at 0,10,…100 %
npm run shots -- --query "motion=reduce"        # reduced-motion stills
npm run shots -- --at 12,18 --viewport mobile   # specific frames
```

Query params for manual testing: `?nointro` (skip the cold open), `?nosmooth`
(native scroll), `?motion=reduce`, `?lowpower`.

Fonts: Clash Display and Satoshi are self-hosted in `public/fonts` (ITF Free Font
License via Fontshare); JetBrains Mono and Instrument Serif come from fontsource.

## Accessibility and motion

- One `h1`, landmarks, labelled forms with live error messages, skip link, gold focus rings, canvas `aria-hidden`.
- `prefers-reduced-motion` or the footer toggle: no smooth scroll, no drift, no video; stills cross-fade.

## Legal

The disclaimer text in `copy.ts` (`DISCLAIMER`, `DISCLAIMER_LONG`) is marked
`[OWNER'S COUNSEL TO REVIEW WORDING]`. Privacy and Terms pages have headings and
`[OWNER TO SUPPLY]` bodies. Screens in the generated pictures are out of focus and carry no real data; the
sections around them are labelled as sample data.
