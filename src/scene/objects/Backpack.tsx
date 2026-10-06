import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useSettings } from '../../store/useSettings'
import { readScene } from '../useSceneUniforms'
import { clamp, lerp, smoothstep } from '../../lib/math'
import glowVert from '../shaders/hero-glow.vert'
import glowFrag from '../shaders/hero-glow.frag'
import canvasPars from '../shaders/bag-canvas-pars.glsl'
import canvasColor from '../shaders/bag-canvas-color.glsl'
import canvasNormal from '../shaders/bag-canvas-normal.glsl'
import contactVert from '../shaders/bag-contact.vert'
import contactFrag from '../shaders/bag-contact.frag'

/** world point where the gold particles pour out (the open zipper) */
export const BACKPACK_MOUTH = new THREE.Vector3(0, 0.52, 0)

const CANVAS = '#1e231f'
const GOLD = '#D2A64B'

/** body height to the collar; the lid brings the whole bag to ~0.52 m */
const H = 0.47
/** how far the top slouches back (a bag resting on the floor leans into its straps) */
const LEAN = 0.04
const LID_Y = H + 0.026
const LID = { a: 0.15, b: 0.104, n: 2.8, skirt: 0.03, dome: 0.034, centerZ: -0.04 }
/** the closed lid droops a little over the front */
const LID_REST_TILT = 0.1
const LID_HINGE_Z = LID.centerZ - LID.b
const LID_OPEN_ANGLE = 1.15
/** the bag faces the hero camera (+z) turned a little so it reads in three dimensions */
const YAW = -0.26

type Tone = [number, number, number]
const TONE_CANVAS: Tone = [1, 1, 1]
const TONE_LID: Tone = [0.94, 0.94, 0.96]
const TONE_WEBBING: Tone = [0.5, 0.5, 0.56]
const TONE_PIPING: Tone = [0.42, 0.42, 0.47]
const TONE_LEATHER: Tone = [2.6, 1.9, 1.15]
const TONE_MESH: Tone = [0.62, 0.64, 0.6]

/* ------------------------------------------------------------------ body maths */

interface Section {
  ax: number
  zF: number
  zB: number
  nF: number
  nB: number
}

/** cross-section of the body at height fraction t: half width, front z, back z, superellipse exponents */
function section(t: number): Section {
  const cinch = smoothstep(0.62, 1, t)
  const ax = (0.15 + 0.016 * Math.sin(Math.PI * t)) * (1 - 0.26 * cinch)
  const zF = (0.092 + 0.048 * Math.sin(Math.PI * Math.pow(t, 0.8))) * (1 - 0.38 * cinch)
  const zB = -(0.095 - 0.012 * t) * (1 - 0.22 * cinch)
  return { ax, zF, zB, nF: 2.7, nB: 3.6 }
}
const shear = (t: number) => -LEAN * t * t
const spow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e)

/** point on the body surface at height fraction t and angle a (0 = +x, π/2 = +z, the front) */
function surfacePoint(t: number, a: number, out: THREE.Vector3) {
  const s = section(t)
  const c = Math.cos(a)
  const sn = Math.sin(a)
  const n = sn >= 0 ? s.nF : s.nB
  const zc = (s.zF + s.zB) / 2
  const bz = (s.zF - s.zB) / 2
  return out.set(s.ax * spow(c, 2 / n), t * H, zc + bz * spow(sn, 2 / n) + shear(t))
}
/** z of the front panel at (x, y) */
function frontZ(x: number, y: number) {
  const t = clamp(y / H)
  const s = section(t)
  const k = clamp(Math.abs(x) / s.ax)
  const zc = (s.zF + s.zB) / 2
  const bz = (s.zF - s.zB) / 2
  return zc + bz * Math.pow(1 - Math.pow(k, s.nF), 1 / s.nF) + shear(t)
}
/** x of a side panel (sx = ±1) at (y, z) */
function sideX(sx: number, y: number, z: number) {
  const t = clamp(y / H)
  const s = section(t)
  const zc = (s.zF + s.zB) / 2
  const bz = (s.zF - s.zB) / 2
  const rel = z - shear(t) - zc
  const n = rel >= 0 ? s.nF : s.nB
  const k = clamp(Math.abs(rel) / bz)
  return sx * s.ax * Math.pow(1 - Math.pow(k, n), 1 / n)
}

/* ------------------------------------------------------------------ geometry helpers */

interface Vtx {
  p: THREE.Vector3
  wear: number
  tone: Tone
}

/**
 * Closed-in-u parametric grid with shared seams (smooth normals), optional
 * fan caps, vertex colour (tone) and a wear attribute. Winding is checked
 * against `center(v)` so every piece faces outward.
 */
function grid(
  rows: number,
  cols: number,
  fn: (u: number, v: number, out: Vtx) => void,
  opts: { capBottom?: boolean; capTop?: boolean; center?: (v: number) => THREE.Vector3 } = {},
) {
  const vtx: Vtx = { p: new THREE.Vector3(), wear: 0, tone: TONE_CANVAS }
  const n = (rows + 1) * cols + (opts.capBottom ? 1 : 0) + (opts.capTop ? 1 : 0)
  const pos = new Float32Array(n * 3)
  const col = new Float32Array(n * 3)
  const wear = new Float32Array(n)
  const uv = new Float32Array(n * 2)
  const rowSum: THREE.Vector3[] = []
  let k = 0
  const put = (p: THREE.Vector3, tone: Tone, w: number, u: number, v: number) => {
    pos[k * 3] = p.x
    pos[k * 3 + 1] = p.y
    pos[k * 3 + 2] = p.z
    col[k * 3] = tone[0]
    col[k * 3 + 1] = tone[1]
    col[k * 3 + 2] = tone[2]
    wear[k] = w
    uv[k * 2] = u
    uv[k * 2 + 1] = v
    k++
  }
  for (let i = 0; i <= rows; i++) {
    const sum = new THREE.Vector3()
    for (let j = 0; j < cols; j++) {
      vtx.wear = 0
      vtx.tone = TONE_CANVAS
      fn(j / cols, i / rows, vtx)
      put(vtx.p, vtx.tone, vtx.wear, j / cols, i / rows)
      sum.add(vtx.p)
    }
    rowSum.push(sum.multiplyScalar(1 / cols))
  }
  const idx: number[] = []
  const at = (i: number, j: number) => i * cols + (j % cols)
  // outward test on the first quad
  const A = new THREE.Vector3().fromArray(pos, at(0, 0) * 3)
  const D = new THREE.Vector3().fromArray(pos, at(1, 0) * 3)
  const C = new THREE.Vector3().fromArray(pos, at(1, 1) * 3)
  const faceN = new THREE.Vector3().subVectors(D, A).cross(new THREE.Vector3().subVectors(C, A))
  const centre = opts.center ? opts.center(0) : rowSum[0]
  const flip = faceN.dot(new THREE.Vector3().subVectors(A, centre)) < 0
  const tri = (a: number, b: number, c: number) => (flip ? idx.push(a, c, b) : idx.push(a, b, c))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      tri(at(i, j), at(i + 1, j), at(i + 1, j + 1))
      tri(at(i, j), at(i + 1, j + 1), at(i, j + 1))
    }
  }
  if (opts.capBottom) {
    const c = k
    vtx.wear = 0
    vtx.tone = TONE_CANVAS
    fn(0, 0, vtx)
    put(rowSum[0], vtx.tone, vtx.wear * 0.5, 0.5, 0)
    for (let j = 0; j < cols; j++) tri(c, at(0, j), at(0, j + 1))
  }
  if (opts.capTop) {
    const c = k
    vtx.wear = 0
    vtx.tone = TONE_CANVAS
    fn(0, 1, vtx)
    put(rowSum[rows], vtx.tone, vtx.wear, 0.5, 1)
    for (let j = 0; j < cols; j++) tri(c, at(rows, j + 1), at(rows, j))
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aWear', new THREE.BufferAttribute(wear, 1))
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

/** give a stock geometry (tube, box) the colour + wear attributes the canvas material needs */
function tag(g: THREE.BufferGeometry, tone: Tone, wear: number) {
  const n = g.attributes.position.count
  const col = new Float32Array(n * 3)
  const w = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    col[i * 3] = tone[0]
    col[i * 3 + 1] = tone[1]
    col[i * 3 + 2] = tone[2]
    w[i] = wear
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aWear', new THREE.BufferAttribute(w, 1))
  return g
}

interface Frame {
  p: THREE.Vector3
  t: THREE.Vector3
  n: THREE.Vector3
  b: THREE.Vector3
}

/** sample a curve into frames whose flat face points along `normalFor(p)` */
function frames(curve: THREE.Curve<THREE.Vector3>, count: number, normalFor: (p: THREE.Vector3, out: THREE.Vector3) => THREE.Vector3): Frame[] {
  const out: Frame[] = []
  for (let i = 0; i <= count; i++) {
    const s = i / count
    const p = curve.getPointAt(s)
    const t = curve.getTangentAt(s).normalize()
    const n = normalFor(p, new THREE.Vector3())
    // orthogonalise: b = n × t (so the profile winds like the body does), n = t × b
    const b = new THREE.Vector3().crossVectors(n, t).normalize()
    n.crossVectors(t, b).normalize()
    out.push({ p, t, n, b })
  }
  return out
}

/** padded strap / webbing: an elliptical profile swept along frames, capped */
function ribbon(fr: Frame[], width: (s: number) => number, thick: (s: number) => number, tone: Tone, wear: (s: number) => number, around = 8) {
  const rows = fr.length - 1
  const geo = grid(
    rows,
    around,
    (u, v, out) => {
      const f = fr[Math.round(v * rows)]
      const phi = u * Math.PI * 2
      const w = width(v) / 2
      const th = thick(v) / 2
      out.p.copy(f.p).addScaledVector(f.n, Math.cos(phi) * th).addScaledVector(f.b, Math.sin(phi) * w)
      out.tone = tone
      // edges of the strap wear first
      out.wear = wear(v) * (0.3 + 0.7 * Math.abs(Math.sin(phi)))
    },
    { capBottom: true, capTop: true, center: (v) => fr[Math.round(v * rows)].p },
  )
  return geo
}

/** a bulging sewn-on pocket: rim on a surface, pillow outward along `outward` */
function pillow(
  a: number,
  b: number,
  n: number,
  depth: number,
  surface: (lx: number, ly: number, out: THREE.Vector3) => THREE.Vector3,
  outward: (lx: number, ly: number, out: THREE.Vector3) => THREE.Vector3,
  tone: Tone,
  rows = 10,
  cols = 36,
) {
  const o = new THREE.Vector3()
  return grid(
    rows,
    cols,
    (u, v, out) => {
      const ang = -u * Math.PI * 2
      const th = v * 0.93 * (Math.PI / 2)
      const s = Math.pow(Math.cos(th), 0.75)
      const d = depth * Math.pow(Math.sin(th), 0.85) - 0.006
      const lx = a * spow(Math.cos(ang), 2 / n) * s
      const ly = b * spow(Math.sin(ang), 2 / n) * s
      surface(lx, ly, out.p).addScaledVector(outward(lx, ly, o), d)
      out.tone = tone
      // rim and the rounded corners scuff
      out.wear = 0.75 * (1 - v) * (0.4 + 0.6 * Math.pow(Math.abs(Math.sin(2 * ang)), 1.5))
    },
    { capTop: true, center: () => surface(0, 0, new THREE.Vector3()) },
  )
}

const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _s1 = new THREE.Vector3(1, 1, 1)
function place(g: THREE.BufferGeometry, p: THREE.Vector3, yAxis: THREE.Vector3, zAxis: THREE.Vector3) {
  const y = yAxis.clone().normalize()
  const z = zAxis.clone().sub(y.clone().multiplyScalar(zAxis.dot(y))).normalize()
  const x = new THREE.Vector3().crossVectors(y, z)
  _q.setFromRotationMatrix(_m.makeBasis(x, y, z))
  g.applyMatrix4(_m.compose(p, _q, _s1))
  return g
}

/** ladder-lock buckle: a flat rectangular frame with a centre bar, lying in xz, normal +y */
function buckle(w: number, d: number, th = 0.0035, bar = 0.004) {
  const parts = [
    new THREE.BoxGeometry(w, th, bar).translate(0, 0, d / 2 - bar / 2),
    new THREE.BoxGeometry(w, th, bar).translate(0, 0, -d / 2 + bar / 2),
    new THREE.BoxGeometry(w, th * 0.8, bar * 0.8),
    new THREE.BoxGeometry(bar, th, d).translate(w / 2 - bar / 2, 0, 0),
    new THREE.BoxGeometry(bar, th, d).translate(-w / 2 + bar / 2, 0, 0),
  ]
  return mergeGeometries(parts)!
}

/** zipper: dark tape ribbon (canvas) + gold teeth boxes + a pull at the end (gold) */
function zipper(fr: Frame[], tapeTone: Tone) {
  const tape = ribbon(
    fr,
    () => 0.02,
    () => 0.0025,
    tapeTone,
    () => 0.2,
    6,
  )
  const teeth: THREE.BufferGeometry[] = []
  const len = fr.length - 1
  const pitch = 0.0055
  // total length
  let total = 0
  for (let i = 1; i < fr.length; i++) total += fr[i].p.distanceTo(fr[i - 1].p)
  const count = Math.floor(total / pitch)
  for (let i = 0; i <= count; i++) {
    const s = (i / count) * len
    const f = fr[Math.min(len, Math.round(s))]
    const tooth = new THREE.BoxGeometry(0.0045, 0.0032, 0.0046)
    const side = i % 2 === 0 ? 1 : -1
    place(tooth, f.p.clone().addScaledVector(f.n, 0.0025).addScaledVector(f.b, side * 0.0012), f.n, f.t)
    teeth.push(tooth)
  }
  const end = fr[len]
  const slider = new THREE.BoxGeometry(0.012, 0.006, 0.014)
  place(slider, end.p.clone().addScaledVector(end.n, 0.004).addScaledVector(end.t, -0.006), end.n, end.t)
  const pull = new THREE.BoxGeometry(0.007, 0.0022, 0.022)
  place(pull, end.p.clone().addScaledVector(end.n, 0.0045).addScaledVector(end.t, 0.012), end.n, end.t)
  const gold = mergeGeometries([...teeth, slider, pull])!
  return { tape, gold }
}

/* ------------------------------------------------------------------ the parts */


function bodyGeometry() {
  const Rb = 0.03
  const vb = 0.1
  return grid(
    56,
    72,
    (u, v, out) => {
      let y: number
      let s: number
      if (v < vb) {
        const th = (v / vb) * (Math.PI / 2)
        y = Rb * (1 - Math.cos(th))
        s = 1 - 0.2 * (1 - Math.sin(th))
      } else {
        y = Rb + ((v - vb) / (1 - vb)) * (H - Rb)
        s = 1
      }
      const t = y / H
      const a = u * Math.PI * 2
      surfacePoint(t, a, out.p)
      const sec = section(t)
      const zc = (sec.zF + sec.zB) / 2 + shear(t)
      // soft creases where the top cinches, a gentle puff on the panels
      const cinch = smoothstep(0.6, 1, t)
      const crease = cinch * 0.011 * Math.sin(a * 9 + 0.4)
      const puff = 0.007 * Math.sin(a * 3 + t * 7) * Math.sin(Math.PI * t) + 0.005 * Math.sin(a * 5.5 - t * 4) - 0.006 * Math.sin(Math.PI * t) * Math.max(0, Math.sin(a)) * Math.cos(t * 9.4)
      const rx = out.p.x
      const rz = out.p.z - zc
      const rl = Math.hypot(rx, rz) || 1
      const d = (crease + puff) * (v < vb ? 0 : 1)
      out.p.x = rx * s + (rx / rl) * d
      out.p.z = zc + rz * s + (rz / rl) * d
      out.p.y = y
      // wear: the four vertical corners, the base rim and the collar
      const corner = Math.pow(Math.abs(Math.sin(2 * a)), 2.5)
      const base = v < vb * 1.6 ? 1 - v / (vb * 1.6) : 0
      out.wear = clamp(0.55 * corner + 0.6 * base + 0.35 * cinch)
      // fake AO: dark underneath, a little in the cinch
      const ao = 0.6 + 0.4 * smoothstep(0, 0.1, y) - 0.12 * cinch
      out.tone = [ao, ao, ao]
    },
    { capBottom: true, center: (v) => new THREE.Vector3(0, v * H, shear(v) + (section(v).zF + section(v).zB) / 2) },
  )
}

/** rolled hem ring at the top, plus the drawstring cord */
function collarGeometry() {
  const pts: THREE.Vector3[] = []
  const sec = section(1)
  const zc = (sec.zF + sec.zB) / 2 + shear(1)
  for (let i = 0; i < 48; i++) {
    const p = surfacePoint(1, (i / 48) * Math.PI * 2, new THREE.Vector3())
    p.x *= 1.06
    p.z = zc + (p.z - zc) * 1.06
    p.y = H
    pts.push(p)
  }
  const ring = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
  const hem = tag(new THREE.TubeGeometry(ring, 96, 0.012, 10, true), [0.88, 0.88, 0.9], 0.55)
  const cordPts = pts.map((p) => new THREE.Vector3(p.x * 1.1, H + 0.008, zc + (p.z - zc) * 1.12))
  const cord = tag(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cordPts, true), 96, 0.0025, 6, true), TONE_WEBBING, 0.1)
  // cord lock at the front
  const lock = new THREE.CylinderGeometry(0.006, 0.006, 0.014, 10).rotateX(Math.PI / 2).translate(0, H + 0.008, sec.zF * 1.12 + zc + 0.004)
  return { hem, cord, lock }
}

function frontPocket() {
  const cy = 0.155
  const geo = pillow(
    0.105,
    0.08,
    2.6,
    0.045,
    (lx, ly, out) => out.set(lx, cy + ly, frontZ(lx, cy + ly)),
    (lx, ly, out) => out.set(lx * 0.3, (ly > 0 ? ly : ly * 0.5) * 0.3, 1).normalize(),
    TONE_CANVAS,
  )
  // zip across the top of the pocket, following the pillow
  const zipPts: THREE.Vector3[] = []
  for (let i = 0; i <= 12; i++) {
    const lx = lerp(-0.085, 0.085, i / 12)
    const ly = 0.052
    const k = Math.pow(Math.pow(Math.abs(lx / 0.105), 2.6) + Math.pow(Math.abs(ly / 0.08), 2.6), 1 / 2.6)
    const th = Math.acos(Math.pow(clamp(k), 1 / 0.75))
    const d = 0.045 * Math.pow(Math.sin(th), 0.85) - 0.006
    zipPts.push(new THREE.Vector3(lx, cy + ly, frontZ(lx, cy + ly) + d))
  }
  const zf = frames(new THREE.CatmullRomCurve3(zipPts), 24, (_, o) => o.set(0, 0.35, 1))
  const zip = zipper(zf, TONE_PIPING)
  // piping around the pocket rim
  const rim: THREE.Vector3[] = []
  for (let i = 0; i < 40; i++) {
    const ang = (i / 40) * Math.PI * 2
    const lx = 0.105 * spow(Math.cos(ang), 2 / 2.6) * 0.98
    const ly = 0.08 * spow(Math.sin(ang), 2 / 2.6) * 0.98
    rim.push(new THREE.Vector3(lx, cy + ly, frontZ(lx, cy + ly) + 0.002))
  }
  const piping = tag(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rim, true), 80, 0.0035, 6, true), TONE_PIPING, 0.4)
  return { geo, tape: zip.tape, gold: zip.gold, piping }
}

/** mesh water-bottle pocket on the −x side (the side the hero camera sees first) */
function sidePocket() {
  const cy = 0.12
  const cz = 0.01
  return pillow(
    0.05,
    0.1,
    2.4,
    0.03,
    (lx, ly, out) => out.set(sideX(-1, cy + ly, cz + lx), cy + ly, cz + lx),
    (lx, ly, out) => out.set(-1, ly * 0.25, lx * 0.4).normalize(),
    TONE_MESH,
    8,
    28,
  )
}

function shoulderStraps() {
  const parts: THREE.BufferGeometry[] = []
  const gold: THREE.BufferGeometry[] = []
  for (const sx of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sx * 0.05, 0.4, -0.06),
      new THREE.Vector3(sx * 0.09, 0.355, -0.15),
      new THREE.Vector3(sx * 0.125, 0.25, -0.2),
      new THREE.Vector3(sx * 0.155, 0.12, -0.19),
      new THREE.Vector3(sx * 0.17, 0.02, -0.15),
      new THREE.Vector3(sx * 0.155, 0.012, -0.1),
      new THREE.Vector3(sx * 0.13, 0.03, -0.075),
    ])
    const fr = frames(curve, 40, (p, o) => o.set(p.x * 1.2, 0, p.z + 0.07).normalize())
    parts.push(
      ribbon(
        fr,
        (s) => lerp(0.07, 0.03, smoothstep(0.35, 0.75, s)),
        (s) => lerp(0.018, 0.005, smoothstep(0.4, 0.75, s)),
        TONE_WEBBING,
        (s) => 0.45 + 0.3 * (1 - s),
        10,
      ),
    )
    // ladder-lock where the padding turns into webbing
    const f = fr[Math.round(0.68 * 40)]
    gold.push(place(buckle(0.034, 0.02), f.p.clone().addScaledVector(f.n, 0.005), f.n, f.t))
  }
  return { geo: mergeGeometries(parts)!, gold: mergeGeometries(gold)! }
}

/** compression straps wrapping the sides, each with a ladder-lock */
function compressionStraps() {
  const parts: THREE.BufferGeometry[] = []
  const gold: THREE.BufferGeometry[] = []
  for (const sx of [-1, 1]) {
    for (const y of [0.3, 0.165]) {
      const t = y / H
      const pts: THREE.Vector3[] = []
      const a0 = sx < 0 ? Math.PI - 0.6 : 0.6
      const a1 = sx < 0 ? Math.PI + 0.55 : -0.55
      for (let i = 0; i <= 16; i++) {
        const a = lerp(a0, a1, i / 16)
        const p = surfacePoint(t, a, new THREE.Vector3())
        const sec = section(t)
        const zc = (sec.zF + sec.zB) / 2 + shear(t)
        const r = Math.hypot(p.x, p.z - zc) || 1
        p.x += (p.x / r) * 0.006
        p.z += ((p.z - zc) / r) * 0.006
        pts.push(p)
      }
      const fr = frames(new THREE.CatmullRomCurve3(pts), 24, (p, o) => {
        const sec = section(t)
        return o.set(p.x, 0, p.z - (sec.zF + sec.zB) / 2 - shear(t)).normalize()
      })
      parts.push(
        ribbon(
          fr,
          () => 0.02,
          () => 0.004,
          TONE_WEBBING,
          () => 0.3,
          6,
        )
      )
      const f = fr[11]
      gold.push(place(buckle(0.028, 0.018), f.p.clone().addScaledVector(f.n, 0.004), f.n, f.t))
    }
  }
  return { geo: mergeGeometries(parts)!, gold: mergeGeometries(gold)! }
}

/** vertical piping down the side seams and a reinforced seam around the base */
function seams() {
  const parts: THREE.BufferGeometry[] = []
  for (const a of [Math.PI * 0.5 + 0.9, Math.PI * 1.5 - 0.9, Math.PI * 0.5 - 0.9, Math.PI * 1.5 + 0.9]) {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 14; i++) {
      const t = lerp(0.08, 0.97, i / 14)
      const p = surfacePoint(t, a, new THREE.Vector3())
      const sec = section(t)
      const zc = (sec.zF + sec.zB) / 2 + shear(t)
      const r = Math.hypot(p.x, p.z - zc) || 1
      p.x += (p.x / r) * 0.002
      p.z += ((p.z - zc) / r) * 0.002
      pts.push(p)
    }
    parts.push(tag(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, 0.003, 6, false), TONE_PIPING, 0.7))
  }
  const base: THREE.Vector3[] = []
  for (let i = 0; i < 48; i++) {
    const p = surfacePoint(0.07, (i / 48) * Math.PI * 2, new THREE.Vector3())
    const sec = section(0.07)
    const zc = (sec.zF + sec.zB) / 2
    const r = Math.hypot(p.x, p.z - zc) || 1
    p.x += (p.x / r) * 0.003
    p.z += ((p.z - zc) / r) * 0.003
    base.push(p)
  }
  parts.push(tag(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(base, true), 96, 0.0045, 7, true), TONE_PIPING, 0.8))
  return mergeGeometries(parts)!
}

/** the leather brand patch and the short webbing stubs under the lid buckles */
function frontDetails() {
  const label = tag(new THREE.BoxGeometry(0.034, 0.016, 0.003), TONE_LEATHER, 0.3)
  const lz = frontZ(0, 0.3)
  label.rotateX(-0.12).translate(0, 0.3, lz + 0.001)
  const parts = [label]
  for (const sx of [-1, 1]) {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 6; i++) {
      const y = lerp(0.35, 0.265, i / 6)
      pts.push(new THREE.Vector3(sx * 0.068, y, frontZ(sx * 0.068, y) + 0.003))
    }
    const fr = frames(new THREE.CatmullRomCurve3(pts), 12, (_, o) => o.set(0, 0.2, 1).normalize())
    parts.push(
      ribbon(
        fr,
        () => 0.02,
        () => 0.004,
        TONE_WEBBING,
        () => 0.3,
        6,
      ),
    )
  }
  return mergeGeometries(parts)!
}

/** lid surface height above its base at lid-local (x, z) relative to the lid centre */
function lidHeight(x: number, z: number) {
  const k = Math.pow(Math.pow(Math.abs(x / LID.a), LID.n) + Math.pow(Math.abs(z / LID.b), LID.n), 1 / LID.n)
  if (k >= 1) return LID.skirt
  const th = Math.acos(Math.pow(k, 1 / 0.5))
  return LID.skirt + LID.dome * Math.pow(Math.sin(th), 1.5)
}

/** the domed top lid: hinge at the local origin (back edge), the lid extends to +z */
function lidGeometry() {
  const cz = LID.b
  const canvas: THREE.BufferGeometry[] = []
  const gold: THREE.BufferGeometry[] = []
  const lid = grid(
    22,
    64,
    (u, v, out) => {
      const ang = -u * Math.PI * 2
      let s: number
      let y: number
      if (v < 0.3) {
        s = 1
        y = (v / 0.3) * LID.skirt
      } else {
        const th = ((v - 0.3) / 0.7) * 0.93 * (Math.PI / 2)
        s = Math.pow(Math.cos(th), 0.5)
        y = LID.skirt + LID.dome * Math.pow(Math.sin(th), 1.5)
      }
      const x = LID.a * spow(Math.cos(ang), 2 / LID.n) * s
      const z = LID.b * spow(Math.sin(ang), 2 / LID.n) * s
      // a slight sag at the front edge and a puff in the middle
      const puff = 0.004 * Math.sin(ang * 4 + 1) * Math.sin(Math.PI * v) * (v > 0.3 ? 1 : 0)
      out.p.set(x, y + puff, cz + z)
      out.tone = TONE_LID
      const corner = Math.pow(Math.abs(Math.sin(2 * ang)), 2.5)
      out.wear = clamp(0.5 * corner * (v < 0.45 ? 1 : 0.4) + 0.4 * (1 - v) * (v < 0.3 ? 1 : 0))
    },
    { capBottom: true, capTop: true, center: () => new THREE.Vector3(0, 0.02, cz) },
  )
  canvas.push(lid)
  // rim piping
  const rim: THREE.Vector3[] = []
  for (let i = 0; i < 48; i++) {
    const ang = (i / 48) * Math.PI * 2
    rim.push(new THREE.Vector3(LID.a * spow(Math.cos(ang), 2 / LID.n) * 1.01, LID.skirt * 0.5, cz + LID.b * spow(Math.sin(ang), 2 / LID.n) * 1.01))
  }
  canvas.push(tag(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rim, true), 96, 0.0035, 6, true), TONE_PIPING, 0.6))
  // zip across the lid pocket (front slope), slider on the right
  const zipPts: THREE.Vector3[] = []
  for (let i = 0; i <= 14; i++) {
    const x = lerp(-0.1, 0.1, i / 14)
    const z = 0.03 + 0.012 * Math.cos((x / 0.1) * Math.PI * 0.5)
    zipPts.push(new THREE.Vector3(x, lidHeight(x, z) + 0.001, cz + z))
  }
  const zf = frames(new THREE.CatmullRomCurve3(zipPts), 28, (p, o) => o.set(0, 1, (p.z - cz) * 2.5).normalize())
  const zip = zipper(zf, TONE_PIPING)
  canvas.push(zip.tape)
  gold.push(zip.gold)
  // grab handle: a webbing loop over the back edge
  const hPts = [
    new THREE.Vector3(-0.04, LID.skirt + 0.01, 0.025),
    new THREE.Vector3(-0.035, LID.skirt + 0.045, 0.005),
    new THREE.Vector3(0, LID.skirt + 0.06, -0.005),
    new THREE.Vector3(0.035, LID.skirt + 0.045, 0.005),
    new THREE.Vector3(0.04, LID.skirt + 0.01, 0.025),
  ]
  const hf = frames(new THREE.CatmullRomCurve3(hPts), 20, (p, o) => o.set(0, 1, -0.8 + (p.y - LID.skirt) * 4).normalize())
  canvas.push(
    ribbon(
      hf,
      () => 0.022,
      () => 0.006,
      TONE_WEBBING,
      () => 0.5,
      6,
    ),
  )
  // two buckle straps from the lid top, over the front edge, down to the body
  for (const sx of [-1, 1]) {
    const x = sx * 0.068
    // below the lid the strap lies on the body's front panel (lid-local, pre-tilted so it lands after the rest tilt)
    const onBody = (y: number) => {
      const wy = LID_Y + y
      const wz = frontZ(x, wy) + 0.004
      const ly = wy - LID_Y
      const lz = wz - LID_HINGE_Z
      const c = Math.cos(-LID_REST_TILT)
      const sn = Math.sin(-LID_REST_TILT)
      return new THREE.Vector3(x, ly * c - lz * sn, ly * sn + lz * c)
    }
    const pts = [
      new THREE.Vector3(x, lidHeight(x, 0.02) + 0.002, cz + 0.02),
      new THREE.Vector3(x, lidHeight(x, 0.07) + 0.003, cz + 0.07),
      new THREE.Vector3(x, LID.skirt * 0.9, cz + LID.b + 0.006),
      onBody(-0.02),
      onBody(-0.06),
      onBody(-0.1),
      onBody(-0.14),
    ]
    const fr = frames(new THREE.CatmullRomCurve3(pts), 24, (p, o) => {
      const over = smoothstep(0.0, LID.skirt, p.y)
      return o.set(0, over, 1 - over * 0.8).normalize()
    })
    canvas.push(
      ribbon(
        fr,
        () => 0.02,
        () => 0.004,
        TONE_WEBBING,
        () => 0.35,
        6,
      ),
    )
    const f = fr[23]
    gold.push(place(buckle(0.023, 0.015, 0.003, 0.0032), f.p.clone().addScaledVector(f.n, 0.004), f.n, f.t))
  }
  return { canvas: mergeGeometries(canvas)!, gold: mergeGeometries(gold)! }
}

/* ------------------------------------------------------------------ materials */

function canvasMaterial(cheap: boolean) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: CANVAS,
    roughness: 0.86,
    metalness: 0,
    sheen: cheap ? 0 : 0.4,
    sheenRoughness: 0.85,
    sheenColor: new THREE.Color('#4d4c42'),
    vertexColors: true,
  })
  if (cheap) mat.defines = { BAG_CHEAP: '' }
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aWear;\nvarying float vWear;\nvarying vec3 vBagPos;\nvarying vec3 vBagNrm;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBagPos = position;\nvBagNrm = normal;\nvWear = aWear;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${canvasPars}`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${canvasColor}`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor - 0.18 * vBagScuff, 0.0, 1.0);')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${canvasNormal}`)
  }
  mat.customProgramCacheKey = () => (cheap ? 'bag-canvas-cheap' : 'bag-canvas')
  return mat
}

/**
 * The backpack: a worn canvas daypack, ~0.52 m tall, resting on the floor at
 * the origin, facing the hero camera and turned 15°. Everything is built in
 * code: a slouching superellipse body that cinches into a rolled collar with
 * a drawstring, a domed top lid with two buckle straps, a bulging front zip
 * pocket, a mesh bottle pocket, padded shoulder straps resting on the floor,
 * compression straps, seam piping, gold ladder-locks and zips. The canvas is
 * a MeshPhysicalMaterial with sheen plus a procedural weave bump, mottling
 * and scuffed edges (vertex wear mask × noise) injected with onBeforeCompile.
 *
 * uOpen = r.local(2, 0, 0.45) lifts the lid on its back hinge and grows a gold
 * glow in the collar; over r.local(2, 0.4, 0.9) the bag shrinks and sinks (it
 * pours into the skyline); hidden from 03 local 0.9 onward.
 * 7 draw calls: canvas body, lid canvas, gold hardware, lid gold, lining,
 * mouth glow, contact shadow.
 */
export function Backpack() {
  const lowPower = useSettings((s) => s.lowPower)
  const root = useRef<THREE.Group>(null)
  const lid = useRef<THREE.Group>(null)
  const lining = useRef<THREE.Mesh>(null)
  const mouth = useRef<THREE.Mesh>(null)

  const parts = useMemo(() => {
    const body = bodyGeometry()
    const collar = collarGeometry()
    const pocket = frontPocket()
    const straps = shoulderStraps()
    const comp = compressionStraps()
    const lidParts = lidGeometry()
    const canvasGeo = mergeGeometries([body, collar.hem, collar.cord, pocket.geo, pocket.tape, pocket.piping, sidePocket(), straps.geo, comp.geo, seams(), frontDetails()])!
    const goldGeo = mergeGeometries([pocket.gold, straps.gold, comp.gold, collar.lock])!
    const sec = section(1)
    const liningGeo = new THREE.CircleGeometry(1, 28).scale(sec.ax * 1.02, (sec.zF - sec.zB) * 0.52, 1)
    const liningZ = (sec.zF + sec.zB) / 2 + shear(1)
    const mouthGeo = new THREE.PlaneGeometry(1, 1)
    const shadowGeo = new THREE.PlaneGeometry(0.72, 0.56)
    const canvasMat = canvasMaterial(lowPower)
    const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.45, metalness: 0.6, emissive: new THREE.Color(GOLD), emissiveIntensity: 0.06 })
    const liningMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#0a0806') })
    const mouthMat = new THREE.ShaderMaterial({
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      uniforms: {
        uColor: { value: new THREE.Color(GOLD) },
        uIntensity: { value: 0 },
        uFalloff: { value: new THREE.Vector2(4.5, 7) },
        uCore: { value: 10 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    })
    const shadowMat = new THREE.ShaderMaterial({
      vertexShader: contactVert,
      fragmentShader: contactFrag,
      uniforms: { uStrength: { value: 0.82 } },
      transparent: true,
      depthWrite: false,
      fog: false,
    })
    return { canvasGeo, goldGeo, lidCanvas: lidParts.canvas, lidGold: lidParts.gold, liningGeo, liningZ, mouthGeo, shadowGeo, canvasMat, goldMat, liningMat, mouthMat, shadowMat }
  }, [lowPower])

  useFrame(() => {
    const r = readScene()
    const g = root.current
    if (!g) return
    // The bag belongs to the first beat of her journey (SHOT 03): "From a girl
    // with a backpack." It stays closed, and leaves before the city rises.
    g.visible = r.shot === 2 && !r.reduced && r.shotProgress < 0.72
    if (!g.visible) return
    const open = 0
    const gone = 0
    g.scale.set(1, 1, 1)
    g.position.y = 0

    if (lid.current) lid.current.rotation.x = LID_REST_TILT * (1 - open) - open * LID_OPEN_ANGLE
    const glow = open * (1 + r.flash * 0.8)
    const k = 0.04 + 2.6 * glow
    parts.liningMat.color.setRGB(0.82 * k, 0.65 * k, 0.29 * k)
    if (mouth.current) {
      mouth.current.visible = open > 0.03
      parts.mouthMat.uniforms.uIntensity.value = 1.6 * glow
      const s = 0.5 + 0.9 * open
      mouth.current.scale.set(s * 1.3, s, 1)
    }
    parts.shadowMat.uniforms.uStrength.value = 0.82 * (1 - gone)
  })

  return (
    <group ref={root} rotation-y={YAW}>
      <mesh geometry={parts.canvasGeo} material={parts.canvasMat} castShadow={!lowPower} receiveShadow />
      <mesh geometry={parts.goldGeo} material={parts.goldMat} castShadow={!lowPower} />
      <mesh ref={lining} geometry={parts.liningGeo} material={parts.liningMat} position={[0, H - 0.006, parts.liningZ]} rotation-x={-Math.PI / 2} />
      <group ref={lid} position={[0, LID_Y, LID_HINGE_Z]} rotation-x={LID_REST_TILT}>
        <mesh geometry={parts.lidCanvas} material={parts.canvasMat} castShadow={!lowPower} receiveShadow />
        <mesh geometry={parts.lidGold} material={parts.goldMat} />
      </group>
      <mesh ref={mouth} geometry={parts.mouthGeo} material={parts.mouthMat} position={[0, H + 0.06, 0]} rotation-x={-Math.PI / 2} renderOrder={22} visible={false} />
      <mesh geometry={parts.shadowGeo} material={parts.shadowMat} position={[0, 0.004, -0.02]} rotation-x={-Math.PI / 2} renderOrder={1} />
    </group>
  )
}
