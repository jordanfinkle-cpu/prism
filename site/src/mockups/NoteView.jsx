import { FolderTag, Check, Disc } from './parts.jsx'
import { NOTE } from './fixtures.js'

const TABS = ['Summary', 'Action items', 'Transcript']

function Skeleton({ rows = 5 }) {
  const widths = ['92%', '78%', '86%', '61%', '70%']
  return (
    <div style={{ display: 'grid', gap: 11, paddingTop: 4 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ height: 12, borderRadius: 6, background: '#EBEBEC', width: widths[i % widths.length] }} />
      ))}
    </div>
  )
}

/* Summary / Action items / Transcript, at the app's own measurements.

   `tab` picks the pane, `reveal` (0…1) is how much of the pane has been
   written — the hero uses it to fill the note in a line at a time, everything
   else leaves it at 1. */
export default function NoteView({
  w = 660,
  tab = 0,
  reveal = 1,
  skeleton = false,
  title = NOTE.title,
  showHead = true,
  indicator = true,
}) {
  const summaryShown = Math.round(reveal * NOTE.summary.length + 0.001)
  const actionsShown = Math.round(reveal * NOTE.actions.length + 0.001)

  return (
    <div style={{ width: w, maxWidth: '100%', boxSizing: 'border-box' }}>
      {showHead && (
        <>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#9A9A9C' }}>{NOTE.date}</div>
          <h3
            style={{
              margin: '7px 0 0',
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: '-0.028em',
              lineHeight: 1.1,
              color: '#181819',
            }}
          >
            {title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 11 }}>
            <FolderTag name={NOTE.folder} color={NOTE.color} />
            <span style={{ fontSize: 11.5, fontWeight: 500, color: '#9A9A9C' }} className="tabular">
              {NOTE.duration}
            </span>
          </div>
        </>
      )}

      {indicator && (
        <div style={{ position: 'relative', display: 'flex', gap: 20, marginTop: 20, borderBottom: '1px solid rgba(24,24,25,.07)' }}>
          {TABS.map((t, i) => (
            <div
              key={t}
              style={{
                position: 'relative',
                paddingBottom: 10,
                fontSize: 13.5,
                fontWeight: i === tab ? 700 : 500,
                letterSpacing: '-0.008em',
                color: i === tab ? '#181819' : '#9A9A9C',
              }}
            >
              {t}
              {i === tab && (
                <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: '#181819', borderRadius: 2 }} />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ paddingTop: 16, minHeight: 210 }}>
        {skeleton ? (
          <Skeleton />
        ) : tab === 0 ? (
          <div style={{ display: 'grid', gap: 13 }}>
            {NOTE.summary.slice(0, summaryShown).map((p, i) => (
              <p key={i} style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, color: '#181819' }}>
                {p}
              </p>
            ))}
          </div>
        ) : tab === 1 ? (
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#9A9A9C', marginBottom: 6 }}>My action items</div>
            {NOTE.actions.slice(0, actionsShown).map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 11,
                  paddingBlock: 11,
                  borderBottom: '1px solid rgba(24,24,25,.07)',
                }}
              >
                <Check on={false} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, lineHeight: 1.45, color: '#181819' }}>{a.text}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 500, color: '#9A9A9C', marginTop: 3 }}>
                    {a.who} · due {a.due}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 15 }}>
            {NOTE.transcript.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 11 }}>
                <Disc tone={t.side === 'you' ? 'green' : 'violet'} size={26} label={t.who[0]} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 500, color: '#9A9A9C', marginBottom: 3 }}>
                    {t.who} <span style={{ color: '#C6C6C8' }}>·</span> {t.side === 'you' ? 'your mic' : 'what you heard'}
                  </div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#181819' }}>{t.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
