import type { Fact } from '../content/facts'

/**
 * Facts that are not yet verified show a visible [VERIFY] tag always.
 * Verified facts carry data-verify and show the tag only in dev mode.
 */
export function FactValue({ fact }: { fact: Fact }) {
  const showTag = !fact.verified || import.meta.env.DEV
  return (
    <span data-verify={fact.verified ? fact.source ?? 'verified' : 'unverified'}>
      {fact.value}
      {showTag && (
        <span className="verify" aria-label={fact.verified ? 'verified' : 'needs verification'}>
          {fact.verified ? '[OK]' : '[VERIFY]'}
        </span>
      )}
    </span>
  )
}
