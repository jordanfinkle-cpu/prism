import { useEffect, useRef, useState } from 'react'
import { requestAccess } from '../lib/access.js'
import { looksLikeEmail } from '../lib/email.js'

const SUCCESS =
  'You are on the list. Keys go out in weekly batches, so watch for an email from Prism.'

const CONTACT = 'privacy@downloadprism.com'

function mailtoFallback(email) {
  const body = `Please add me to the Prism early access list.${email ? `\n\n${email}` : ''}`
  return `mailto:${CONTACT}?subject=${encodeURIComponent('Prism early access')}&body=${encodeURIComponent(body)}`
}

export default function RequestAccess({ variant = 'hero', source = 'site' }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | submitting | success | error
  const [error, setError] = useState('')
  const mountedAt = useRef(0)
  const trapRef = useRef(null)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    if (state === 'submitting') return

    // A bot fills every field it finds and submits faster than a person can
    // type. Either tell is answered with the success screen, not an error —
    // a rejection is a signal to retry differently.
    const trapped = Boolean(trapRef.current?.value)
    const tooFast = Date.now() - mountedAt.current < 1200
    if (trapped || tooFast) {
      setState('success')
      return
    }

    if (!looksLikeEmail(email)) {
      setError('That does not look like an email address.')
      setState('error')
      return
    }

    setState('submitting')
    const res = await requestAccess(email, source)
    if (res.ok) {
      setState('success')
    } else {
      setError(res.error)
      setState('error')
    }
  }

  const dark = variant === 'close'

  if (state === 'success') {
    return (
      <p className={`ra-done ${dark ? 'ra-dark' : ''}`} role="status">
        <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true">
          <path
            d="M4.5 10.5l3.6 3.6L15.5 6.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{SUCCESS}</span>
      </p>
    )
  }

  return (
    <form className={`ra ${dark ? 'ra-dark' : ''}`} onSubmit={onSubmit} noValidate>
      <div className="ra-row">
        <label className="sr-only" htmlFor={`ra-${variant}`}>
          Email address
        </label>
        <input
          id={`ra-${variant}`}
          className="ra-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck="false"
          maxLength={254}
          required
          placeholder="you@work.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={state === 'error' ? `ra-err-${variant}` : undefined}
        />

        {/* Off-screen rather than display:none — some bots skip hidden fields. */}
        <div className="ra-trap" aria-hidden="true">
          <label htmlFor={`ra-website-${variant}`}>Website</label>
          <input
            ref={trapRef}
            id={`ra-website-${variant}`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button className="ra-btn" type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Sending…' : 'Request access'}
        </button>
      </div>

      {state === 'error' ? (
        <p className="ra-err" id={`ra-err-${variant}`} role="alert">
          {error}{' '}
          {/* Never let a failed request be the end of it — an address typed in
              good faith should always have somewhere to go. */}
          <a className="ra-err-link" href={mailtoFallback(email)}>
            Email us instead
          </a>
        </p>
      ) : (
        <p className="ra-help">Free. Invite only. Keys go out in weekly batches.</p>
      )}

      <style>{`
        .ra { width: 100%; max-width: 520px; }
        .ra-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ra-input {
          flex: 1 1 240px;
          min-width: 0;
          height: 52px;
          padding-inline: 18px;
          border: 0;
          border-radius: var(--radius-field);
          background: var(--color-surface);
          box-shadow: 0 0 0 1px var(--hairline-strong) inset;
          font: inherit;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.012em;
          color: var(--color-ink);
          transition: box-shadow 0.14s ease;
        }
        .ra-input::placeholder { color: var(--color-ink3); }
        .ra-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px var(--color-ink) inset;
        }
        .ra-dark .ra-input {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.16) inset;
        }
        .ra-dark .ra-input:focus {
          box-shadow: 0 0 0 2px var(--color-night-ink) inset;
        }
        .ra-btn {
          flex: 0 0 auto;
          height: 52px;
          padding-inline: 22px;
          border: 0;
          border-radius: var(--radius-field);
          background: var(--color-ink);
          color: #fff;
          font: inherit;
          font-size: 16px;
          font-weight: 500;
          letter-spacing: -0.012em;
          cursor: pointer;
          transition: transform 0.18s cubic-bezier(.34,1.4,.64,1), opacity 0.18s ease;
        }
        .ra-btn:active { transform: scale(0.975); }
        .ra-btn:disabled { opacity: 0.55; cursor: default; }
        .ra-dark .ra-btn {
          background: var(--color-night-ink);
          color: var(--color-ink);
        }
        .ra-help, .ra-err {
          margin: 12px 0 0;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.004em;
        }
        .ra-help { color: var(--tone-ink3, var(--color-ink3)); }
        .ra-err { color: #d6301f; }
        .ra-dark .ra-err { color: #ff6a5e; }
        .ra-err-link { color: inherit; text-underline-offset: 3px; white-space: nowrap; }
        .ra-trap {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        .ra-done {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 0;
          max-width: 480px;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.012em;
          line-height: 1.45;
          color: var(--tone-ink, var(--color-ink));
        }
        .ra-done svg {
          flex: none;
          margin-top: 4px;
          color: #1d9e47;
        }
        .ra-dark.ra-done svg { color: var(--color-green); }
      `}</style>
    </form>
  )
}
