import { useId, useState, type FormEvent } from 'react'
import { CALCULATOR, CTA } from '../content/copy'
import { Accent } from '../ui/Accent'
import { Nav } from '../ui/Nav'
import { Footer } from '../sections/Footer'
import { Disclaimer } from '../ui/Disclaimer'
import './pages.css'

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

/** The 4% rule: yearly income ÷ 0.04 = yearly income × 25. */
export function CalculatorPage() {
  const id = useId()
  const [monthly, setMonthly] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const m = Number(String(monthly).replace(/[^0-9.]/g, ''))
    setResult(m > 0 ? (m * 12) / 0.04 : null)
  }

  return (
    <div className="page">
      <div className="page__bg" aria-hidden="true" />
      <Nav home={false} />
      <main id="main" className="page__main">
        <section className="calc" aria-label="Freedom number calculator">
          <div>
            <p className="shot__kicker mono">{CALCULATOR.kicker}</p>
            <h1 className="display display--lg shot__headline">
              <Accent text={CALCULATOR.headline} />
            </h1>
            <p className="lede shot__copy">{CALCULATOR.body}</p>
            <p className="mono mono--sm ash" style={{ marginTop: 16 }}>
              {CALCULATOR.method}
            </p>
          </div>
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label className="field__label mono" htmlFor={`${id}-m`}>
                {CALCULATOR.label}
              </label>
              <div className="calc__prefix">
                <span className="display display--sm gold" aria-hidden="true">
                  $
                </span>
                <input
                  id={`${id}-m`}
                  className="field__input calc__input"
                  inputMode="decimal"
                  placeholder="10,000"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  aria-describedby={`${id}-help`}
                />
              </div>
              <p className="field__error" id={`${id}-help`} />
            </div>
            <button type="submit" className="btn btn--gold form__submit">
              {CALCULATOR.submit}
            </button>
            <div className="calc__result" role="status" aria-live="polite">
              <span className="mono mono--sm ash">{CALCULATOR.resultLabel}</span>
              <span className="calc__number">{result === null ? '—' : fmt.format(result)}</span>
              <span className="ash" style={{ fontSize: 'var(--fs-body-sm)' }}>
                {CALCULATOR.resultSub}
              </span>
            </div>
          </form>
        </section>
        <section className="page__section" aria-labelledby="next">
          <p className="shot__kicker mono">{CALCULATOR.nextKicker}</p>
          <h2 id="next" className="display display--md shot__headline shot__headline--wide">
            <Accent text={CALCULATOR.nextHeadline} />
          </h2>
          <p className="lede shot__copy">{CALCULATOR.nextBody}</p>
          <div className="shot__ctas">
            <a href="/#apply" className="btn btn--gold" data-route>
              {CTA.apply}
            </a>
          </div>
          <Disclaimer />
        </section>
      </main>
      <Footer />
    </div>
  )
}
