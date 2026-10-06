/**
 * World layout, in meters, y up. Everything in the scene imports from here so
 * the camera path and the objects agree.
 *
 *  - The octagon sits at the origin on the arena floor (y = 0).
 *  - The backpack sits at the origin, ~0.5 m tall.
 *  - Eight fence posts at OCTAGON_RADIUS become eight towers in SHOT 03.
 *  - Shots 05–08 move through a city that grows around the octagon.
 */
export const WORLD = {
  octagonRadius: 5,
  fenceHeight: 1.85,
  postCount: 8,
  /** octagon rotated so a flat edge faces +z (the hero camera) */
  postAngleOffset: Math.PI / 8,
  towerHeight: 34,
  towerWidth: 2.2,
  /** background city block footprint */
  cityExtent: 90,
  /** 30-day light rig above the octagon */
  lightRig: { y: 14, cols: 6, rows: 5, spacing: 2.2 },
  /** data wall for SHOT 06 */
  terminalWall: { center: [0, 6, -40] as [number, number, number], width: 40, height: 12 },
  /** phone for SHOT 07 (dark corner of the set) */
  phone: { center: [22, 1.6, -22] as [number, number, number] },
  /** arena bowl seats for SHOT 08 */
  seats: { innerRadius: 11, outerRadius: 26, rows: 18 },
  /** gold constellation for SHOT 12 (above the tower ring so the crane shot reads it) */
  constellation: { center: [0, 46, 0] as [number, number, number], size: 14 },
} as const

export const postPositions = (): [number, number, number][] =>
  Array.from({ length: WORLD.postCount }, (_, i) => {
    const a = WORLD.postAngleOffset + (i / WORLD.postCount) * Math.PI * 2
    return [Math.cos(a) * WORLD.octagonRadius, 0, Math.sin(a) * WORLD.octagonRadius]
  })

/**
 * SHOT 05 — the camera walks a street from z=+14 to z=−14. Round n's hero
 * object sits ~3.2 m ahead of where the camera is when its beat is centered,
 * alternating sides of the street.
 */
export const ROUND_COUNT = 6
export const STREET = { x: 0, y: 1.7, zStart: 14, zEnd: -14 }
export const roundPosition = (n: number): [number, number, number] => {
  const t = (n - 0.5) / ROUND_COUNT
  const z = STREET.zStart + (STREET.zEnd - STREET.zStart) * t - 3.2
  // just right of the street axis (the copy block is bottom-left); the hero
  // towers occupy |x| 0.8–3.0 at |z| 3.5–5.7, so anything further out is swallowed
  const x = 0.68
  return [x, 1.55, z]
}
/** 0..1 how "present" round n is at shot-05 progress p (1 at its center beat) */
export const roundPresence = (p: number, n: number) => {
  const c = (n - 0.5) / ROUND_COUNT
  const half = 0.5 / ROUND_COUNT
  const d = Math.abs(p - c) / half
  // plateau: fully present for the middle 45 % of the beat, condensing in and out at the edges
  return Math.max(0, Math.min(1, (1 - d) / 0.55))
}
