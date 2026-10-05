# THE WALKOUT — architecture contract

Read `REDESIGN-PROMPT.md` for the brief. This file is the engineering contract
every part of the build must respect.

## Layers

```
<Scene/>  fixed, z 0, one persistent <Canvas>, aria-hidden        src/scene
<main/>   real DOM copy, z 10, one <section class="shot"> per shot  src/sections
chrome    nav / belt / slate / letterbox / grain / flash / preloader src/ui
```

Text is never rendered inside WebGL. Every 3D object is always mounted and
decides its own visibility per frame.

## Scroll → scene

`src/store/useScroll.ts` is the single source of truth, updated every GSAP tick:

| field          | meaning                                              |
| -------------- | ---------------------------------------------------- |
| `progress`     | 0..1 over the whole document                         |
| `shot`         | current shot index 0..11 (SHOT 01 = 0)               |
| `shotProgress` | 0..1 inside the current shot                         |
| `shotFloat`    | `shot + shotProgress` (e.g. 2.4 = 40 % into SHOT 03) |
| `wind`         | 0..1 scroll speed (gold dust, chromatic aberration)  |
| `flash`        | 0..1 hard-cut / cold-open energy, decays per frame   |
| `pointer`      | −1..1 normalized pointer (follow-spot cursor)        |

Inside `useFrame`, call `readScene()` (`src/scene/useSceneUniforms.ts`):

```ts
const r = readScene()
r.local(2, 0.2, 0.8) // 0..1 between 20 % and 80 % of SHOT 03 (index 2); 0 before, 1 after
r.span(2, 3)         // 0 at start of SHOT 03 → 1 at end of SHOT 04
r.wind, r.flash, r.pointer, r.reduced, r.lowPower
```

Never subscribe React state to per-frame values. Mutate uniforms / matrices in
`useFrame`. Never call `set` on the store from the scene.

## Shot indices

| index | id  | title                | camera                                                             |
| ----- | --- | -------------------- | ------------------------------------------------------------------ |
| 0     | 01  | The Walkout          | eye height (0,1.6,4.6) → (0,1.5,3.3), looking at the backpack       |
| 1     | 02  | Tale of the Tape     | 25° orbit around the backpack at r≈3.3                             |
| 2     | 03  | The Backpack         | cranes from (1.4,1.6,3) up to (0.5,32,11), looks down at origin    |
| 3     | 04  | The Record           | lateral glide x −14 → +14 at y≈27, z 16, looking at (0,9,−2)       |
| 4     | 05  | The Playbook         | street level, walks z +14 → −14 at x 0, y 1.7 (see `roundPosition`) |
| 5     | 06  | The Terminal         | street level in front of the wall at z −40                         |
| 6     | 07  | The Alert            | nearly black; phone at `WORLD.phone.center`, camera 1.6–1.9 m away |
| 7     | 08  | The Corner           | pulls back from (0,5,13) to (0,19,36) to reveal the seats          |
| 8     | 09  | 30-Day Challenge     | low, looking up at the light rig at y 14                           |
| 9     | 10  | Apply                | ground level by the octagon, (−9,2.4,3)                            |
| 10    | 11  | Proof wall           | (gated off by default, zero height)                                |
| 11    | 12  | The Crane            | (0,12,26) → (0,62,74), whole set visible                           |

Camera keys live in `src/scene/cameraPath.ts`; world constants in
`src/scene/world.ts` (`WORLD`, `postPositions()`, `roundPosition(n)`,
`roundPresence(p, n)`). Objects import from there; nobody hardcodes positions.

## Scene composition

`src/scene/Set.tsx` mounts every object. Each object file exports one named
component with no required props (`export function Towers()`), reads
`readScene()` in `useFrame`, and owns its own materials/shaders. Shaders are
`.glsl/.vert/.frag` files in `src/scene/shaders/` imported as strings
(vite-plugin-glsl; `#include` works).

Global state that objects must NOT touch: renderer exposure/tone mapping
(`Mood.tsx`), the camera (`CameraRig.tsx`), postprocessing (`Post.tsx`).

## Budgets (desktop / mobile)

- draw calls < 150; all repeated geometry instanced
- particles: 40k desktop / 8k mobile (`r.lowPower`)
- smoke at half resolution on mobile; postprocessing desktop only (already gated)
- `r.reduced`: freeze time-based animation, no particles/smoke motion, keep
  the still composition readable
- no textures from disk; everything procedural

## DOM conventions

- One `h1` (hero). Section headings are `h2`.
- Copy lives in `src/content/copy.ts`, facts in `facts.ts`, unknowns in
  `placeholders.ts`. Components never contain copy strings.
- `*word*` in copy renders the italic serif accent via `<Accent/>`.
- Unknown values render through `<Token/>` or `ImageSlotFrame`.
- Disclaimers: `<Disclaimer/>` under Terminal and Apply, long form in Footer.

## QA

```
npm run dev                      # http://localhost:5173
npx tsc -b                       # typecheck (run before you hand off)
npm run shots -- --at 12,18 --viewport desktop --out screenshots/mine \
    --qa-fonts $QA_FONTS_CSS     # look at the PNGs; fix what looks wrong
```

Query params for QA: `?nointro` `?nosmooth` `?motion=reduce` `?nowebgl` `?lowpower`.
