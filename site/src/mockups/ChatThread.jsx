import { Mark } from './parts.jsx'
import { CHAT, ACCENTS } from './fixtures.js'

function Cite({ title, color }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px 4px 8px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 500,
        color: '#6A6A6C',
        background: '#fff',
        boxShadow: '0 0 0 1px rgba(24,24,25,.07)',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 999, background: ACCENTS[color], flex: 'none' }} />
      {title}
    </span>
  )
}

function Ask({ q }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{
          maxWidth: '78%',
          background: '#EBEBEC',
          borderRadius: '16px 16px 5px 16px',
          padding: '10px 14px',
          fontSize: 14,
          lineHeight: 1.5,
          color: '#181819',
        }}
      >
        {q}
      </div>
    </div>
  )
}

/* The answer always arrives with its sources attached. The second exchange is
   there on purpose: a notetaker that will say "your notes do not say" is the
   only kind worth asking. */
export default function ChatThread({ w = 680, refusal = true }) {
  return (
    <div style={{ width: w, maxWidth: '100%', display: 'grid', gap: 22, boxSizing: 'border-box' }}>
      <Ask q={CHAT.question} />

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 500, color: '#9A9A9C' }}>
          <Mark size={12} color="#9A9A9C" />
          Thought for 4 seconds
        </div>
        <div style={{ display: 'grid', gap: 4, paddingLeft: 19 }}>
          {CHAT.trace.map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 500, color: '#9A9A9C' }}>
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M2.5 6.3l2.2 2.2L9.5 3.7" fill="none" stroke="#9A9A9C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </div>
          ))}
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 14.5, lineHeight: 1.6, color: '#181819' }}>{CHAT.answer}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
          {CHAT.cites.map((c) => (
            <Cite key={c.title} {...c} />
          ))}
        </div>
      </div>

      {refusal && (
        <>
          <Ask q={CHAT.refusal.question} />
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: '#181819' }}>{CHAT.refusal.answer}</p>
        </>
      )}

      <div
        style={{
          marginTop: 2,
          height: 46,
          borderRadius: 18,
          background: '#fff',
          boxShadow: '0 0 0 1px rgba(24,24,25,.055), 0 1px 3px rgba(24,24,25,.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: '16px 6px',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: '#9A9A9C' }}>Ask your notes</span>
        <span style={{ width: 34, height: 34, borderRadius: 999, background: '#181819', display: 'grid', placeItems: 'center' }}>
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
            <path d="M8 12.5V3.8M4.4 7.2L8 3.6l3.6 3.6" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  )
}
