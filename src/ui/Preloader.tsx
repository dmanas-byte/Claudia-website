import { useEffect, useRef, useState } from 'react'
import { PRELOADER } from '../content/copy'
import { useScroll } from '../store/useScroll'
import { useSettings } from '../store/useSettings'
import { startScroll, stopScroll } from '../lib/scroll'

/**
 * SHOT 00 — cold open. Three arena lights thunk on (90 ms white flash + a
 * bloom spike in the scene), ROUND 1 / 2 / 3, then a hard cut. ≤ 2.5 s,
 * skippable, once per session, covers (never blocks) asset loading.
 */
export function Preloader() {
  const [step, setStep] = useState(0)
  const [gone, setGone] = useState(false)
  const timers = useRef<number[]>([])
  const setIntroDone = useSettings((s) => s.setIntroDone)
  const setPreloaderDone = useSettings((s) => s.setPreloaderDone)

  const finish = () => {
    timers.current.forEach(clearTimeout)
    setGone(true)
    startScroll()
    setPreloaderDone()
    setIntroDone()
    useScroll.getState().triggerFlash(1)
  }

  useEffect(() => {
    stopScroll()
    const schedule = [
      [350, 1],
      [850, 2],
      [1350, 3],
    ] as const
    for (const [t, s] of schedule) {
      timers.current.push(
        window.setTimeout(() => {
          setStep(s)
          useScroll.getState().triggerFlash(0.9)
        }, t),
      )
    }
    timers.current.push(window.setTimeout(finish, 2100))
    const hardStop = window.setTimeout(finish, 2500)
    timers.current.push(hardStop)
    return () => timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div className="cold" role="status" aria-live="polite" aria-label="Opening">
      <div className={`cold__light cold__light--1 ${step >= 1 ? 'is-on' : ''}`} aria-hidden="true" />
      <div className={`cold__light cold__light--2 ${step >= 2 ? 'is-on' : ''}`} aria-hidden="true" />
      <div className={`cold__light cold__light--3 ${step >= 3 ? 'is-on' : ''}`} aria-hidden="true" />
      <p className="cold__round mono">{step > 0 ? PRELOADER.rounds[step - 1] : ' '}</p>
      <button type="button" className="cold__skip mono" onClick={finish}>
        {PRELOADER.skip}
      </button>
    </div>
  )
}
