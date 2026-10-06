# Claudia Gadelha site — architecture

## Layers

```
<Film/>   fixed, z 0: full-bleed Higgsfield plates, one per beat     src/film
<main/>   real DOM copy, z 10, one <section class="shot"> per shot  src/sections
chrome    nav / belt / slate / letterbox / grain / preloader         src/ui
```

All text is real DOM. The film layer is decorative (`aria-hidden`).

## Scroll

`src/store/useScroll.ts` is the single source of truth, updated every GSAP tick:

| field          | meaning                                              |
| -------------- | ---------------------------------------------------- |
| `progress`     | 0..1 over the whole document                         |
| `shot`         | current shot index 0..11 (SHOT 01 = 0)               |
| `shotProgress` | 0..1 inside the current shot                         |
| `wind`         | 0..1 scroll speed (letterbox on fast scroll)         |

A shot becomes current once its section covers the middle of the viewport.
Never subscribe React state to per-frame values; components subscribe and
touch the DOM directly.

## The film

`src/content/film.ts` lists every plate (id, what it shows and why, whether it
has a video, mobile focus point) and `plateAt(shot, progress)` maps the scroll
position to a plate. SHOT 03 switches between three plates at the journey
beats (`JOURNEY_BEATS`, shared with the copy); SHOT 05 switches between six
round plates.

`src/film/Film.tsx` keeps every plate mounted at opacity 0, crossfades to the
current one (0.9 s), lazy-loads each still when it is about to be needed, and
plays a plate's looping video only while that plate is current. Inside a
plate the picture drifts slowly with `--p` (local progress). Reduced motion:
stills only, no drift, 0.3 s crossfades.

Assets live in `public/film/` and are produced from the raw renders in `art/`
(not committed) by `node scripts/process-art.mjs`: WebP stills at 1920 and
1080 px, H.264 videos at 1600 and 1280 px, each video played forward then
backward so the loop never jumps.

## Pinned frames

A pinned shot's `.shot__pin` is `position: fixed` and only visible while that
shot is current (`.shot.is-active`), cross-fading in and out. Never put a CSS
transform on `#main` or any ancestor of the frames. Shots whose picture sits
behind the copy pass `scrim="left" | "full" | "center"` to `<Shot>`.

## DOM conventions

- One `h1` (hero). Section headings are `h2`.
- Copy lives in `src/content/copy.ts`, facts in `facts.ts`, unknowns in
  `placeholders.ts`, plates in `film.ts`. Components never contain copy strings.
- `*word*` in copy renders the italic serif accent via `<Accent/>`.
- Disclaimers: `<Disclaimer/>` under the Terminal and Apply shots, long form in the footer.

## QA

```
npm run dev
npx tsc -b
npm run shots -- --shots "03:0.15,03:0.5" --viewport desktop --out screenshots/mine
```

`--shots "<id>:<progress>"` places the page inside a shot. Query params:
`?nointro` `?nosmooth` `?motion=reduce` `?lowpower`.
