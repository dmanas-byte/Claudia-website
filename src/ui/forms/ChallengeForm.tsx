import { useId, useState, type FormEvent } from 'react'
import { CHALLENGE } from '../../content/copy'
import { FORM_ENDPOINT_CONFIGURED, isEmail, useFormSubmit } from './useFormSubmit'

export function ChallengeForm() {
  const id = useId()
  const { status, submit } = useFormSubmit('challenge')
  const [errors, setErrors] = useState<{ first?: string; email?: string }>({})

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const first = String(fd.get('first_name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const next: typeof errors = {}
    if (!first) next.first = 'Please add your first name.'
    if (!isEmail(email)) next.email = 'Please enter a valid email.'
    setErrors(next)
    if (Object.keys(next).length) return
    await submit({ first_name: first, email, company: String(fd.get('company') ?? '') })
  }

  if (status === 'success') {
    return (
      <div className="form__success" role="status" aria-live="polite">
        <p className="display display--sm">{CHALLENGE.success}</p>
        <p className="lede lede--dim">{CHALLENGE.successSub}</p>
        {!FORM_ENDPOINT_CONFIGURED && <p className="mono mono--sm gold">{CHALLENGE.demoNote}</p>}
      </div>
    )
  }

  return (
    <form className="form form--challenge" onSubmit={onSubmit} noValidate aria-describedby={`${id}-consent`}>
      <div className="form__row">
        <div className="field">
          <label className="field__label mono" htmlFor={`${id}-first`}>
            {CHALLENGE.firstName}
          </label>
          <input
            id={`${id}-first`}
            name="first_name"
            className="field__input"
            autoComplete="given-name"
            required
            aria-invalid={!!errors.first}
            aria-describedby={errors.first ? `${id}-first-err` : undefined}
          />
          <p className="field__error" id={`${id}-first-err`} aria-live="polite">
            {errors.first ?? ''}
          </p>
        </div>
        <div className="field">
          <label className="field__label mono" htmlFor={`${id}-email`}>
            {CHALLENGE.email}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            className="field__input"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-err` : undefined}
          />
          <p className="field__error" id={`${id}-email-err`} aria-live="polite">
            {errors.email ?? ''}
          </p>
        </div>
      </div>
      {/* honeypot */}
      <div className="form__hp" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn--gold form__submit" aria-busy={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : CHALLENGE.submit}
      </button>
      <p className="form__consent mono mono--sm ash" id={`${id}-consent`}>
        {CHALLENGE.consent}{' '}
        <a href="/privacy" data-route className="gold">
          {CHALLENGE.privacy}
        </a>{' '}
        {CHALLENGE.and}{' '}
        <a href="/terms" data-route className="gold">
          {CHALLENGE.terms}
        </a>
        .
      </p>
      <p className="form__error field__error" role="alert" aria-live="assertive">
        {status === 'error' ? CHALLENGE.error : ''}
      </p>
    </form>
  )
}
