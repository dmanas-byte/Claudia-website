# Build "THE WALKOUT" — a cinematic WebGL redesign of cgadelha.com

## 0. Read this first

You are building a complete redesign of Claudia Gadelha's website (today: https://www.cgadelha.com/, "Claudia Gadelha's Financial Freedom Program") inside this empty git repository, `Claudia-website`. The owner's instruction is literal: build "the absolute most ridiculous website redesign... an absolutely amazing website beyond belief." Take that at face value. The bar is not "a nice landing page." The bar is: a person opens this on a laptop, says something out loud, sends the link to a friend, and then signs up for the 30-day challenge.

Ship it as a static site (Vite + React + TypeScript) deployable to Vercel, Netlify or GitHub Pages. No backend. No paid APIs. Free, open-source web tech only. Forms POST to a placeholder endpoint read from `VITE_FORM_ENDPOINT`.

## 1. The vision: the site is a film

Every section is a shot. The page is one continuous camera move through a dark arena that, as the visitor scrolls, becomes a city of light. Think Apple product launch × UFC walkout × Bloomberg terminal. Smoke on the floor, follow-spots cutting through it, a chain-link octagon, gold dust in the air, and hard-edged financial data glowing like a trading floor at 4 a.m.

The narrative spine is Claudia's own line: she went "from someone with just a backpack into a self-made wealth architect." The first 3D object the visitor sees is a single backpack on the arena floor. By the final shot it has poured itself into a skyline. The octagon's eight fence posts become eight towers. The fight is the metaphor; the portfolio is the product.

Who she is (use only these facts; everything else is a placeholder): Claudia "Claudinha" Gadelha, from Mossoró, Brazil. Former UFC women's strawweight top contender; came up through Jungle Fight and Invicta FC; fought Joanna Jędrzejczyk for the UFC strawweight title; long-time top-ranked strawweight; retired from competition around 2020–2021 (verify exact dates and any record numbers against reputable sources before publishing, and if you cannot verify, leave a `[VERIFY]` placeholder). 4th-degree Brazilian Jiu-Jitsu black belt. Law graduate. Now a UFC executive and high-performance mentor.

What the program sells (this must be understandable within 10 seconds of landing): a financial-education program with (1) a stock & crypto portfolio playbook with full portfolio access: numbers, tickers, shares; (2) real-time trade alerts: a text every time Claudia places an order; (3) options signals plus a 6-week options course; (4) live weekly community calls; (5) access to her Airbnb portfolio and how she generates short-term-rental income; (6) curated real-estate deals and partnerships from her network. Entry funnel: a free "30-Day Challenge" opt-in (currently at cgadelha.com/optin-1404). Socials: X @ClaudiaGadelha_, YouTube @Claudinhagadelha, TikTok @claudinhagadelha, Threads @claudiagadelha, Facebook "Claudinha Gadelha". Sister site gadelhaclaudia.com is premium health coaching (link it in the footer only).

## 2. Stack and budgets

- Vite, React (current stable), TypeScript. `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap` (ScrollTrigger is free), `lenis` for smooth scroll, `zustand` for scroll/scene state, `vite-plugin-glsl` for shader files. Playwright for screenshots. No UI kits, no Tailwind templates, no component libraries. Hand-written CSS modules or vanilla CSS with custom properties.
- One persistent fullscreen `<Canvas>` fixed behind the DOM. All copy is real DOM text layered above it. Never render text inside WebGL.
- Scroll progress (0–1) drives a single camera path (CatmullRom spline) and every shader uniform. Sections are ScrollTrigger pins; the canvas never unmounts between shots.
- Budgets: first-load JS under 220 KB gzipped excluding the lazily-loaded three.js chunk; total page weight under 6 MB; zero external images required to look finished; 60 fps on a 2020 laptop, 30+ fps on a mid-range Android; DPR capped at 1.5 on mobile and 2 on desktop; under 150 draw calls per frame; all geometry instanced; postprocessing (bloom, chromatic aberration, film grain) desktop-only; LCP under 2.5 s; Lighthouse accessibility 95+.

## 3. Type, color, and texture

- Display: **Clash Display** (Fontshare), weights 500/600/700, used huge, tight tracking (−0.03em), often uppercase.
- Body: **Satoshi** (Fontshare), 400/500/700, 17–19 px, generous leading.
- Data and labels: **JetBrains Mono** (Google Fonts), 11–13 px, uppercase tracking +0.12em, used for tickers, timestamps, shot numbers ("SHOT 04 / 12"), and disclaimers.
- One accent: **Instrument Serif** italic (Google Fonts), used for a single emphasized word per headline at most, never a whole sentence.
- Palette as CSS custom properties: `--arena: #07070A` (page background), `--smoke: #15161C`, `--bone: #F2EEE6` (primary text), `--ash: #8B8C93` (secondary), `--gold: #D2A64B` (CTAs, particles, belt stripes), `--ember: #FF5A1F` (one alert color only), `--terminal: #38E8FF` (data glow). No purple anywhere. No gradients on text. Light comes from the 3D scene, not from CSS.
- Texture: a 2–3 % animated film grain over everything on desktop, 2.39:1 letterbox bars that slide in during camera moves and out during reading moments, subtle vignette, and anamorphic horizontal lens flares on the follow-spots.

## 4. Persistent elements

- **Nav**: top-left wordmark "CLAUDIA GADELHA" in Clash Display, top-right two links ("The Program", "Her Story") and one gold pill CTA "Start the 30-Day Challenge". Nav hides on scroll-down and returns on scroll-up (GSAP, 0.4 s, `power2.out`).
- **The Belt**: the scroll-progress indicator is a thin horizontal BJJ belt pinned to the bottom edge. It starts white, and as the user scrolls it transitions through the rank colors to black, then earns four red degree stripes (one per quarter of the page) that tick on with a 120 ms gold flash. At 100 % the belt "ties": a 600 ms knot animation in SVG.
- **Mobile sticky CTA**: a bottom pill "Start the Challenge" that appears after the hero and never covers form inputs.
- **Shot slate**: bottom-left mono text "SHOT 03 / 12 — THE BACKPACK" that cross-fades per section (opacity 0.6, 300 ms).

## 5. Section-by-section spec (the shot list)

**SHOT 00 — Cold open (preloader).** Black. Three arena lights thunk on one at a time (each a 90 ms white flash with a bloom spike), mono text counts "ROUND 1 / 2 / 3", then a hard cut to the hero. Maximum 2.5 s, has a "Skip" link, uses `sessionStorage` so it never plays twice per session, and does not block asset loading (it covers it).

**SHOT 01 — The Walkout (hero).** Camera at eye height in a dark arena, slowly dollying forward at 0.15 m/s with a 0.5° handheld sway (noise-driven). Floor-level smoke from a fullscreen fragment shader (domain-warped FBM, three octaves, drifting at 0.02 uv/s). Two volumetric follow-spots (additive cone meshes with radial-falloff shaders) converge on a single low-poly backpack at center. Chain-link octagon fence behind it, drawn with a shader on a plane (procedural chain-link pattern, alpha-tested, slight metallic sheen). Headline, bottom-left, four lines stacked: "FROM A BACKPACK." / "TO A *wealth* ARCHITECT." (italic accent on one word). Below, in Satoshi, the 10-second offer: "Claudia Gadelha's financial-education program: her real portfolio, every trade alert by text, a 6-week options course, her Airbnb playbook, and live weekly calls." Two CTAs: gold pill "Start the free 30-Day Challenge" and ghost button "Apply to the Program". Headline lines enter as a mask-reveal (each line translateY 110 % → 0, 0.9 s, `expo.out`, stagger 0.08 s) after the cold open. The cursor is a follow-spot: a third, smaller spotlight follows the pointer across the floor smoke, lagging 120 ms (lerp 0.1). On touch devices the spot follows the last touch and drifts slowly otherwise.

**SHOT 02 — Tale of the Tape.** Pinned section. Broadcast-style stat graphic draws in from the center like a fight-night lower third: two columns, "THE FIGHTER" and "THE ARCHITECT". Left: Mossoró, Brazil / Jungle Fight → Invicta FC → UFC / Title fight vs. Joanna Jędrzejczyk / Long-time top-ranked strawweight / Retired ~2020–21 `[VERIFY]`. Right: 4th-degree BJJ black belt / Law graduate / UFC executive / High-performance mentor / Self-made wealth architect. Each row wipes in with a gold scanline (0.5 s, `power3.inOut`, stagger 0.07 s). The camera orbits 25° around the backpack during the pin. Every date or number carries a `data-verify` attribute and renders a tiny mono "[VERIFY]" tag in dev mode.

**SHOT 03 — The Backpack.** The signature morph. Over 150 vh of scroll, the backpack's zipper opens (a morph target on the mesh, or a shader-driven vertex displacement) and 40,000 gold particles (instanced points, curl-noise flow field in the vertex shader) pour upward. Simultaneously the eight fence posts of the octagon extrude into eight towers (instanced boxes with a procedural emissive-window shader, windows flickering on at random with a 2 s Poisson cadence). By the end of the section, the camera has craned up 30 m and tilted down: the arena has become a city block seen from above, the octagon outline still glowing on the ground as a street plan. Copy, pinned center-left: "Everything I know about money, I learned the way I learned to fight: *reps*, coaching, and showing my work."

**SHOT 04 — The Record (her story).** A horizontal scroll-jacked timeline (vertical scroll converted to horizontal translate, scrub 0.8 s). Six "fight posters" as designed typographic frames (no photos): MOSSORÓ, JUNGLE FIGHT, INVICTA FC, UFC, THE TITLE FIGHT, THE NEXT CHAPTER. Each poster is a dark card with a huge Clash Display number, a mono date slot `[DATE — VERIFY]`, and a 12:16 placeholder image frame with the caption "OWNER TO SUPPLY: photo of ___". As each poster centers, the city towers in the background light one more floor.

**SHOT 05 — The Playbook (six rounds).** This is the product. Six pinned beats, each a "round" with a round-card graphic ("ROUND 1 OF 6") swung in by a round-card flip (rotateY 90 → 0, 0.7 s, `back.out(1.4)`). Each round has one 3D hero object materializing from gold particles into solid geometry over the scroll: Round 1 Portfolio Playbook (a glass slab with a scrolling ticker shader: tickers, shares, numbers: all labeled SAMPLE); Round 2 Real-Time Trade Alerts (a floating phone-sized plane with a text-message bubble that pops in); Round 3 Options Signals + 6-Week Course (six stacked translucent panes, one per week); Round 4 Live Weekly Calls (a ring of small spotlights pointing inward); Round 5 Airbnb Portfolio (a wireframe house whose windows warm up); Round 6 Real-Estate Deals (a keyring with wireframe keys). Copy per round: a 3–5-word headline, one 25-word sentence, one mono "WHAT YOU GET" line. Sample headlines: "Every order I place, you get the text." / "My real portfolio. Tickers, shares, numbers." / "Six weeks to read an options chain." / "Short-term rentals, long-term thinking."

**SHOT 06 — The Terminal.** The camera drops to street level in front of a 40 m-wide glass wall covered in a procedural Bloomberg-style data shader: columns of mono numbers scrolling at different speeds, green/red ticks, sparklines drawn in the fragment shader. Every number is procedurally generated noise and the wall carries a permanent mono overlay: "SAMPLE DATA — ILLUSTRATIVE ONLY — NOT REAL PERFORMANCE." DOM copy over it: "Learn to love your life. Unlock your *wealth* potential." and three mono lines explaining what "real portfolio training" means (watching real positions, understanding why, building your own). No returns, no percentages, no "students made X."

**SHOT 07 — The Alert.** A full-viewport beat. The scene goes almost black, then a phone notification slides in from the top of a 3D phone plane with a 40 ms ember flash and a 2-frame screen shake: "CLAUDIA: Just placed an order. Details inside." Timestamp slot `[SAMPLE]`. Copy: "You don't learn by watching highlights. You learn in real time." CTA: "Apply to the Program."

**SHOT 08 — The Corner.** Live weekly calls and community. The camera pulls back to reveal the arena seats filled with 20,000 point-lights (instanced sprites) that pulse in a slow wave. No member counts unless the owner supplies them: use `[MEMBER COUNT — OWNER TO SUPPLY]`. Copy: "Nobody fights alone. Nobody builds alone." Mono schedule slot: "LIVE CALLS — WEEKLY — [DAY/TIME — OWNER TO SUPPLY]".

**SHOT 09 — The 30-Day Challenge (primary conversion).** Pinned. A 5×6 grid of 30 arena-light cells lights up in sequence as the section scrolls (each a 60 ms flash, `steps(1)`), ending with all 30 lit and bloomed. Headline: "Thirty days. One corner. *Your* money." Sub: a clear sentence about what the challenge is, with `[OWNER TO CONFIRM CHALLENGE CONTENT]` where specifics are unknown. Form: first name + email, one gold button "Start the Challenge", POSTs to `VITE_FORM_ENDPOINT`, inline success state ("You're in. Check your inbox.") and error state, a honeypot field, and a consent line. Also make `/optin-1404` route to this section so existing links keep working.

**SHOT 10 — Apply.** The program CTA. Price: `[PRICING — OWNER TO SUPPLY]` rendered as a designed placeholder, not a fake number. "Who this is for / not for" as two mono columns. Button "Apply to the Program" opens a second form (name, email, one short question) to the same endpoint with a `form=apply` field.

**SHOT 11 — Proof wall.** Build it, but gate it behind `VITE_SHOW_TESTIMONIALS=false` by default. Cards are placeholder frames reading "TESTIMONIAL — OWNER TO SUPPLY (name, role, permission on file)". Never write a sample testimonial, even lorem-style.

**SHOT 12 — Final pull-back + footer.** The camera cranes up and back until the whole set is visible: an octagon of light in the center of a glowing city, backpack-shaped constellation of gold particles above it. Headline: "Your *walkout* starts here." Both CTAs again. Footer: socials, sister-site link, Privacy, Terms, full disclaimer block, "© Claudia Gadelha [YEAR]".

## 6. Signature Moments (non-negotiable)

1. **The backpack-to-skyline morph**: 40k gold particles pour out of the zipper and the octagon posts become towers, driven entirely by scroll.
2. **The cursor is a follow-spot**: a lagging volumetric light that cuts through floor smoke wherever the pointer goes.
3. **The Belt**: a scroll progress bar that ranks up from white to black belt, earns four red degree stripes, and ties itself at the end.
4. **Cold-open arena lights**: three thunking spotlights and a ROUND 1/2/3 count before the first frame.
5. **Letterbox cuts**: 2.39:1 bars slide in during camera moves and the transition between shots is a hard cut with a single 2-frame white flash and a bloom spike, never a fade.
6. **The Terminal wall**: a fragment-shader data wall with scrolling columns and sparklines, loudly labeled as sample data.
7. **The Alert**: a phone notification that arrives with an ember flash and a two-frame screen shake.
8. **Round cards**: each program feature enters as a flipped round card, with its 3D object condensing from particles into solid geometry.
9. **Thirty arena lights**: the opt-in section's 30-day grid fires in sequence like a stadium rig powering up.
10. **The final crane shot**: the whole set revealed from above, the backpack now a constellation.
11. **Scroll-velocity gold dust**: ambient particle drift intensifies with scroll speed and settles when the user stops, so fast readers feel wind.

## 7. Anti-patterns (instant fail)

- Centered hero + three feature cards + testimonial carousel.
- Purple or blue-to-pink gradients; glassmorphism cards on gradient blobs; rounded "SaaS" layout.
- "Welcome to my website", "Unlock your potential today!", "Join thousands of..." or any invented social proof.
- Emoji bullet points. Emoji anywhere.
- Stock-photo vibes, Unsplash placeholders, AI-generated fake photos of Claudia.
- Text rendered inside the canvas; canvas-only content with no DOM fallback.
- Scroll-jacking that traps the user; sections the user cannot scroll past in under 2 seconds of continuous scrolling.
- Autoplaying audio. Sound effects may exist only behind an explicit, off-by-default toggle.
- Lorem ipsum, fake prices, fake returns, fake dates, fake member counts.
- A hero that takes more than 10 seconds to explain what is being sold.
- Loading spinners longer than 2.5 s; layout shift when fonts load (preload and `font-display: swap` with size-adjust).

## 8. Asset reality

You have no photos or video of Claudia. Do not fake them. Build the site so it is finished without them: typographic heroes, procedural WebGL scenes, SVG posters, and designed placeholder frames (dark frame, thin gold rule, mono caption "OWNER TO SUPPLY: ___", exact aspect ratio). Put every placeholder in `src/content/placeholders.ts` so each one is swappable in one line. At the end of the build, write `ASSETS_NEEDED.md` listing every asset slot with dimensions, aspect ratio, format, where it appears, and what it should depict (for example: "SHOT 04 / poster 5: 1200×1600 photo from the title fight, rights cleared").

## 9. Legal and compliance guardrails

This is a financial-education business. Non-negotiable:

- A visible disclaimer in the footer and a short one directly beneath both the Terminal and the Apply sections: "Educational content only. Not financial, legal, or tax advice. Past performance is not indicative of future results. Investing involves risk, including loss of principal." Wrap it in `[OWNER'S COUNSEL TO REVIEW WORDING]` in a comment, and keep the text visible regardless.
- Never invent returns, percentages, win rates, student results, testimonials, member counts, pricing, or guarantees. Every unknown is a clearly labeled placeholder, both visually and in code (`PLACEHOLDER_` constants).
- All sample financial data is procedurally generated and labeled "SAMPLE" on-screen wherever it appears.
- Trade-alert copy describes what the service does ("a text when Claudia places an order"), never what the user will earn.
- Privacy and Terms pages exist as placeholder routes with headings and `[OWNER TO SUPPLY]` bodies. The opt-in form has a consent line and links to them.
- Fight-career facts: verify every date and number before publishing; leave `[VERIFY]` where you cannot.

## 10. Mobile, accessibility, reduced motion

- Mobile: same film, cheaper production. Particles capped at 8k, no postprocessing, smoke at half resolution, towers reduced to 8 instanced meshes with baked emissive, camera path identical. Horizontal timeline becomes a snap-scrolling horizontal track with native touch. Sticky bottom CTA. 16 px side gutters, no horizontal page scroll, tap targets 44 px.
- Accessibility: semantic landmarks, one `h1`, logical heading order, all copy as real text, 4.5:1 contrast for body and 3:1 for display, visible focus rings in gold, skip link, canvas `aria-hidden`, forms with labels and error messages announced via `aria-live`, keyboard-reachable CTAs at every shot, no information conveyed by motion alone.
- `prefers-reduced-motion: reduce`: disable Lenis, scroll scrub, screen shake, particles, and smoke animation; replace camera moves with static composed stills per shot that cross-fade over 300 ms; keep the belt as a plain progress bar; keep letterboxing static. Also add a "Reduce motion" toggle in the footer that sets the same state and persists in `localStorage`.
- WebGL unavailable: render a CSS/SVG fallback with the same type and layout, a static SVG octagon-to-skyline illustration, and all content intact.

## 11. Build process

1. Scaffold `npm create vite@latest . -- --template react-ts`, install the stack, commit.
2. Create `src/content/` (copy, placeholders, facts with verify flags), `src/scene/` (Canvas, camera rig, shaders in `.glsl` files via `vite-plugin-glsl`, shots as components keyed to scroll ranges), `src/sections/` (DOM shots), `src/styles/` (tokens, type, layout).
3. Build the camera rig and scroll store first, then the hero, then the morph. Run `npm run dev` and keep it running.
4. Install Playwright and write `scripts/screenshot.ts` that captures 1440×900 and 390×844 at scroll positions 0, 10, 20 ... 100 %. Run it after every major milestone and actually look at the images. Fix anything that looks like a template.
5. Profile with the three.js `Stats` panel and Chrome Performance; hit the budgets in Section 2. Run Lighthouse CLI; fix accessibility and performance regressions.
6. Test `prefers-reduced-motion`, keyboard-only navigation, WebGL-disabled fallback, and the forms with a mock endpoint (`npx json-server` or a simple echo).
7. `npm run build`, then `npm run preview` and re-screenshot the production build.
8. Add `vercel.json` / `netlify.toml` (SPA rewrites, `/optin-1404` → `/#challenge`), `.env.example` with `VITE_FORM_ENDPOINT` and `VITE_SHOW_TESTIMONIALS`, and a README with run, deploy, and content-editing instructions.
9. Write `ASSETS_NEEDED.md`. Commit with clear messages at each milestone.
10. Iterate until it matches Section 12. Do not stop at "it works."

## 12. Definition of done

- Within 10 seconds of landing, a stranger can say what is being sold and where to click.
- The backpack-to-skyline morph, the follow-spot cursor, the Belt, and the Terminal wall all exist and are smooth at 60 fps on desktop.
- Screenshots at every 10 % of scroll on both viewports look like frames from a film, not sections of a template.
- Both CTAs are reachable by keyboard from every shot; forms submit to the env endpoint with success and error states.
- No invented numbers, prices, dates, testimonials, or photos anywhere. Every placeholder is visible, labeled, and listed in `ASSETS_NEEDED.md`.
- Disclaimers are visible on the page without scrolling to the footer from the Terminal and Apply sections.
- Reduced-motion and no-WebGL versions are complete, readable, and still beautiful.
- Lighthouse: Accessibility 95+, Performance 80+ on desktop; no console errors; no layout shift on font load.
- The README lets the owner change any line of copy, swap any placeholder, and deploy in under 15 minutes.

Build it like the walkout is tonight.
