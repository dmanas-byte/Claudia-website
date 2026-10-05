import { Fragment, type ReactNode } from 'react'

/**
 * Renders copy where *one word* is wrapped in the italic serif accent.
 * "To a *wealth* architect." → To a <em class="accent">wealth</em> architect.
 */
export function Accent({ text }: { text: string }): ReactNode {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <em key={i} className="accent">
            {p}
          </em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

/** Splits a multi-line headline into mask-reveal lines. */
export function RevealLines({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <span className={`reveal ${className ?? ''}`} key={i}>
          <span className="reveal__line" data-reveal-line>
            <Accent text={l} />
          </span>
        </span>
      ))}
    </>
  )
}
