import { DISCLAIMER } from '../content/copy'

/* [OWNER'S COUNSEL TO REVIEW WORDING] — the text must stay visible regardless. */
export function Disclaimer({ className }: { className?: string }) {
  return <p className={`disclaimer ${className ?? ''}`}>{DISCLAIMER}</p>
}
