import { useCallback, useState } from 'react'

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT?.trim() ?? ''
export const FORM_ENDPOINT_CONFIGURED = ENDPOINT.length > 0

/**
 * POSTs JSON to VITE_FORM_ENDPOINT. With no endpoint configured the form runs
 * in demo mode: the payload is logged and the success state shows, with a
 * visible note so nobody mistakes it for a live form.
 */
export function useFormSubmit(form: 'apply' | 'speaking') {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const submit = useCallback(
    async (fields: Record<string, string>) => {
      // honeypot: bots fill "company"; humans never see it
      if (fields.company) {
        setStatus('success')
        return true
      }
      setStatus('submitting')
      setMessage('')
      const payload = { form, ...fields, page: window.location.href, ts: new Date().toISOString() }
      delete (payload as Record<string, unknown>).company
      if (!FORM_ENDPOINT_CONFIGURED) {
        await new Promise((r) => setTimeout(r, 500))
        console.info('[walkout] demo submission (set VITE_FORM_ENDPOINT):', payload)
        setStatus('success')
        return true
      }
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setStatus('success')
        return true
      } catch (e) {
        setStatus('error')
        setMessage(e instanceof Error ? e.message : 'Network error')
        return false
      }
    },
    [form],
  )

  return { status, message, submit, reset: () => setStatus('idle') }
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
