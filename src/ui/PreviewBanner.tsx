/** Persistent label on the concept-preview build so it can never pass for the live site. */
export function PreviewBanner() {
  return (
    <div className="preview-banner" role="note">
      <span className="preview-banner__long">
        Concept preview · Redesign prepared for Claudia Gadelha’s review · Not the official site · Forms are switched off
      </span>
      <span className="preview-banner__short">Concept preview · Not the official site</span>
    </div>
  )
}
