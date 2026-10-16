import { Check, FolderTag } from './parts.jsx'
import { TASKS, ACCENTS } from './fixtures.js'

export default function TaskRows({ w = 660, ticked = 0 }) {
  return (
    <div style={{ width: w, maxWidth: '100%', display: 'grid', gap: 8, boxSizing: 'border-box' }}>
      {TASKS.map((t, i) => {
        const on = i < ticked || (t.done && ticked === 0)
        return (
          <div
            key={t.text}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 16,
              background: '#fff',
              boxShadow: '0 0 0 1px rgba(24,24,25,.055), 0 1px 3px rgba(24,24,25,.05)',
              opacity: on ? 0.55 : 1,
              transition: 'opacity .26s cubic-bezier(.2,.8,.2,1)',
            }}
          >
            <div style={{ paddingTop: 1 }}>
              <Check on={on} color={ACCENTS[t.color]} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: '-0.008em',
                  color: '#181819',
                  textDecoration: on ? 'line-through' : 'none',
                }}
              >
                {t.text}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 500, color: '#9A9A9C', marginTop: 4 }}>{t.note}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
              <FolderTag name={t.folder} color={t.color} />
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 22,
                  paddingInline: 9,
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 500,
                  background: t.late ? 'color-mix(in srgb, #FF3B30 10%, transparent)' : '#F5F5F6',
                  color: t.late ? '#C22A21' : '#6A6A6C',
                }}
                className="tabular"
              >
                {t.due}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
