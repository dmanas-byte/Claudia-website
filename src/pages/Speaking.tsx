import { useId, useState, type FormEvent } from 'react'
import { SPEAKING } from '../content/copy'
import { Accent } from '../ui/Accent'
import { ImageSlotFrame } from '../ui/Placeholder'
import { Nav } from '../ui/Nav'
import { Footer } from '../sections/Footer'
import { FORM_ENDPOINT_CONFIGURED, isEmail, useFormSubmit } from '../ui/forms/useFormSubmit'
import './pages.css'
import { PREVIEW } from '../lib/env'

export function SpeakingPage() {
  return (
    <div className="page">
      <div className="page__bg" aria-hidden="true" />
      <Nav home={false} />
      <main id="main" className="page__main">
        <section className="page__hero" aria-label="Speaking and seminars">
          <div>
            <p className="shot__kicker mono">{SPEAKING.kicker}</p>
            <h1 className="display display--lg shot__headline shot__headline--wide">
              <Accent text={SPEAKING.headline} />
            </h1>
            <p className="lede shot__copy">{SPEAKING.body}</p>
            <ul className="creds mono mono--sm" style={{ marginTop: 20 }} aria-label="Credentials">
              {SPEAKING.creds.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="shot__ctas">
              <a href="#book" className="btn btn--gold">
                {SPEAKING.cta}
              </a>
            </div>
          </div>
          <ImageSlotFrame slot="speakingHero" />
        </section>

        <section className="page__section" aria-labelledby="topics">
          <p className="shot__kicker mono">{SPEAKING.topicsKicker}</p>
          <h2 id="topics" className="display display--md">
            {SPEAKING.topicsHeadline}
          </h2>
          <ul className="page__grid">
            {SPEAKING.topics.map((t) => (
              <li className="card" key={t.t}>
                <span className="card__t">{t.t}</span>
                <span className="card__d">{t.d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="gallery" aria-label="On stage">
          <ImageSlotFrame slot="speaking1" />
          <ImageSlotFrame slot="speaking2" />
          <ImageSlotFrame slot="speaking3" />
        </section>

        <section className="page__section" aria-labelledby="why">
          <p className="shot__kicker mono">{SPEAKING.whyKicker}</p>
          <h2 id="why" className="display display--md">
            {SPEAKING.whyHeadline}
          </h2>
          <div style={{ display: 'grid', gap: 14, maxWidth: '44rem' }}>
            {SPEAKING.why.map((p) => (
              <p className="lede" key={p}>
                {p}
              </p>
            ))}
          </div>
        </section>

        <section className="page__section" aria-labelledby="formats">
          <p className="shot__kicker mono">{SPEAKING.formatsKicker}</p>
          <h2 id="formats" className="display display--md">
            {SPEAKING.formatsHeadline}
          </h2>
          <ul className="page__grid">
            {SPEAKING.formats.map((f) => (
              <li className="card" key={f.t}>
                <span className="card__t">{f.t}</span>
                <span className="card__d">{f.d}</span>
              </li>
            ))}
          </ul>
          <blockquote className="pullquote">
            <p>{SPEAKING.quote}</p>
            <footer className="mono mono--sm ash">{SPEAKING.quoteBy}</footer>
          </blockquote>
        </section>

        <section className="page__hero" id="book" aria-labelledby="book-h">
          <div>
            <p className="shot__kicker mono">{SPEAKING.bookKicker}</p>
            <h2 id="book-h" className="display display--md shot__headline">
              <Accent text={SPEAKING.bookHeadline} />
            </h2>
            <p className="lede shot__copy">{SPEAKING.bookBody}</p>
          </div>
          <SpeakingForm />
        </section>
      </main>
      <Footer />
    </div>
  )
}

function SpeakingForm() {
  const id = useId()
  const { status, submit } = useFormSubmit('speaking')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const f = SPEAKING.fields

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const next: typeof errors = {}
    if (!name) next.name = 'Please add your name.'
    if (!isEmail(email)) next.email = 'Please enter a valid email.'
    setErrors(next)
    if (Object.keys(next).length) return
    await submit({
      name,
      email,
      organization: String(fd.get('organization') ?? ''),
      event: String(fd.get('event') ?? ''),
      message: String(fd.get('message') ?? ''),
      company: String(fd.get('company') ?? ''),
    })
  }

  if (status === 'success') {
    return (
      <div className="form__success" role="status" aria-live="polite">
        <p className="display display--sm">{PREVIEW ? 'Preview only. Nothing was sent.' : SPEAKING.success}</p>
        {!FORM_ENDPOINT_CONFIGURED && <p className="mono mono--sm gold">Form endpoint not configured (VITE_FORM_ENDPOINT). Submission logged to console.</p>}
      </div>
    )
  }
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <div className="field">
          <label className="field__label mono" htmlFor={`${id}-name`}>
            {f.name}
          </label>
          <input id={`${id}-name`} name="name" className="field__input" autoComplete="name" required aria-invalid={!!errors.name} />
          <p className="field__error" aria-live="polite">
            {errors.name ?? ''}
          </p>
        </div>
        <div className="field">
          <label className="field__label mono" htmlFor={`${id}-email`}>
            {f.email}
          </label>
          <input id={`${id}-email`} name="email" type="email" className="field__input" autoComplete="email" required aria-invalid={!!errors.email} />
          <p className="field__error" aria-live="polite">
            {errors.email ?? ''}
          </p>
        </div>
      </div>
      <div className="form__row">
        <div className="field">
          <label className="field__label mono" htmlFor={`${id}-org`}>
            {f.org}
          </label>
          <input id={`${id}-org`} name="organization" className="field__input" autoComplete="organization" />
        </div>
        <div className="field">
          <label className="field__label mono" htmlFor={`${id}-event`}>
            {f.event}
          </label>
          <input id={`${id}-event`} name="event" className="field__input" />
        </div>
      </div>
      <div className="field">
        <label className="field__label mono" htmlFor={`${id}-msg`}>
          {f.message}
        </label>
        <textarea id={`${id}-msg`} name="message" className="field__input" rows={4} maxLength={1200} />
      </div>
      <div className="form__hp" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn--gold form__submit" aria-busy={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : SPEAKING.submit}
      </button>
      <p className="mono mono--sm ash">{SPEAKING.respond}</p>
      <p className="form__error field__error" role="alert" aria-live="assertive">
        {status === 'error' ? 'That didn’t go through. Please try again.' : ''}
      </p>
    </form>
  )
}
