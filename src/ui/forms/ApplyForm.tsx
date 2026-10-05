import { useId, useState, type FormEvent } from 'react'
import { APPLY } from '../../content/copy'
import { FORM_ENDPOINT_CONFIGURED, isEmail, useFormSubmit } from './useFormSubmit'
import { CHALLENGE } from '../../content/copy'

export function ApplyForm({ onDone }: { onDone?: () => void }) {
  const id = useId()
  const { status, submit } = useFormSubmit('apply')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const question = String(fd.get('question') ?? '').trim()
    const next: typeof errors = {}
    if (!name) next.name = 'Please add your name.'
    if (!isEmail(email)) next.email = 'Please enter a valid email.'
    setErrors(next)
    if (Object.keys(next).length) return
    const ok = await submit({ name, email, question, company: String(fd.get('company') ?? '') })
    if (ok) onDone?.()
  }

  if (status === 'success') {
    return (
      <div className="form__success" role="status" aria-live="polite">
        <p className="display display--sm">{APPLY.success}</p>
        {!FORM_ENDPOINT_CONFIGURED && <p className="mono mono--sm gold">{CHALLENGE.demoNote}</p>}
      </div>
    )
  }

  return (
    <form className="form form--apply" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="form" value="apply" />
      <div className="form__row">
        <div className="field">
          <label className="field__label mono" htmlFor={`${id}-name`}>
            {APPLY.name}
          </label>
          <input id={`${id}-name`} name="name" className="field__input" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} />
          <p className="field__error" id={`${id}-name-err`} aria-live="polite">
            {errors.name ?? ''}
          </p>
        </div>
        <div className="field">
          <label className="field__label mono" htmlFor={`${id}-email`}>
            {APPLY.email}
          </label>
          <input id={`${id}-email`} name="email" type="email" inputMode="email" className="field__input" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} />
          <p className="field__error" id={`${id}-email-err`} aria-live="polite">
            {errors.email ?? ''}
          </p>
        </div>
      </div>
      <div className="field">
        <label className="field__label mono" htmlFor={`${id}-q`}>
          {APPLY.question}
        </label>
        <textarea id={`${id}-q`} name="question" className="field__input" rows={3} maxLength={400} />
      </div>
      <div className="form__hp" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn--gold form__submit" aria-busy={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : APPLY.submit}
      </button>
      <p className="form__error field__error" role="alert" aria-live="assertive">
        {status === 'error' ? APPLY.error : ''}
      </p>
    </form>
  )
}
