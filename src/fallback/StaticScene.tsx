import './static.css'

/**
 * No-WebGL fallback: a fixed SVG set — octagon of light on the arena floor
 * that rises into a skyline — plus the same type and layout above it.
 */
export function StaticScene() {
  const posts = Array.from({ length: 8 }, (_, i) => {
    const a = Math.PI / 8 + (i / 8) * Math.PI * 2
    return { x: 600 + Math.cos(a) * 240, y: 640 + Math.sin(a) * 90, h: 160 + ((i * 37) % 90) }
  })
  return (
    <div className="static-scene" aria-hidden="true">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="static-scene__svg">
        <defs>
          <radialGradient id="spot" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#fff3dc" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#fff3dc" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#fff3dc" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15161c" />
            <stop offset="100%" stopColor="#07070a" />
          </linearGradient>
          <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38e8ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d2a64b" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="#07070a" />
        <rect y="520" width="1200" height="280" fill="url(#floor)" />
        <polygon points="420,0 780,0 1000,760 200,760" fill="url(#spot)" />
        {posts.map((p, i) => (
          <g key={i}>
            <rect x={p.x - 14} y={p.y - p.h} width="28" height={p.h} fill="url(#tower)" />
            <rect x={p.x - 2} y={p.y - p.h - 60} width="4" height={p.h + 60} fill="#d2a64b" opacity="0.65" />
          </g>
        ))}
        <polygon
          points={posts.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#d2a64b"
          strokeWidth="2"
          opacity="0.9"
          style={{ filter: 'drop-shadow(0 0 8px #d2a64b)' }}
        />
        <g transform="translate(600,640)">
          <path d="M-22 0 L-18 -48 Q0 -62 18 -48 L22 0 Z" fill="#1e1f26" stroke="#d2a64b" strokeWidth="1.5" />
          <path d="M-10 -20 L10 -20 L8 -8 L-8 -8 Z" fill="#232430" />
        </g>
        {Array.from({ length: 70 }, (_, i) => {
          const x = (i * 173) % 1200
          const y = 80 + ((i * 97) % 520)
          return <circle key={i} cx={x} cy={y} r={(i % 3) * 0.6 + 0.6} fill="#d2a64b" opacity={0.25 + (i % 5) * 0.12} />
        })}
      </svg>
    </div>
  )
}
