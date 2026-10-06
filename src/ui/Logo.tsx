/** The CG monogram from the owner's logo, redrawn as a vector so it stays crisp. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--gold)" strokeWidth="7" strokeLinejoin="round">
        <path d="M30 6 H14 a6 6 0 0 0 -6 6 v26 a6 6 0 0 0 6 6 h10 l6 6" />
        <path d="M30 18 h18 a6 6 0 0 1 6 6 v28 a6 6 0 0 1 -6 6 H32 a6 6 0 0 1 -6 -6 V24 a6 6 0 0 1 6 -6" />
        <path d="M54 40 H42 l6 -6" />
      </g>
    </svg>
  )
}
