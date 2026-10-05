import type { Fact } from '../content/facts'

/**
 * Facts that are not yet verified show a visible [VERIFY] tag always.
 * Verified facts carry data-verify and show the tag only in dev mode.
 */
export function FactValue({ fact }: { fact: Fact }) {
  return (
    <span data-verify={fact.verified ? (fact.source ?? 'verified') : 'unverified'} title={fact.verified ? fact.source : fact.note}>
      {fact.value}
      {!fact.verified && (
        <span className="verify" aria-label="needs verification">
          [VERIFY]
        </span>
      )}
      {fact.verified && import.meta.env.DEV && (
        <span className="verify verify--dev" aria-hidden="true">
          [SRC]
        </span>
      )}
    </span>
  )
}
