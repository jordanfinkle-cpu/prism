import { FolderTag } from './parts.jsx'
import { NOTES } from './fixtures.js'

export function NoteCard({ note, clamp = 3, lifted = false }) {
  return (
    <div
      style={{
        breakInside: 'avoid',
        marginBottom: 10,
        padding: '13px 14px',
        borderRadius: 22,
        background: '#fff',
        boxShadow: lifted
          ? '0 0 0 1px rgba(24,24,25,.055), 0 16px 42px rgba(24,24,25,.16)'
          : '0 0 0 1px rgba(24,24,25,.055), 0 1px 3px rgba(24,24,25,.05)',
        transform: lifted ? 'translate(6px,-8px)' : 'none',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.012em', color: '#181819', lineHeight: 1.25 }}>
        {note.title}
      </div>
      <p
        style={{
          margin: '6px 0 10px',
          fontSize: 12,
          lineHeight: 1.45,
          color: '#6A6A6C',
          display: '-webkit-box',
          WebkitLineClamp: clamp,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {note.snippet}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FolderTag name={note.folder} color={note.color} />
        <span style={{ fontSize: 9.5, fontWeight: 500, color: '#9A9A9C' }}>{note.time}</span>
      </div>
    </div>
  )
}

export default function NotesMasonry({ columns = 3, count = NOTES.length, dragging = false }) {
  const list = NOTES.slice(0, count)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.012em', color: '#181819' }}>All notes</div>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: '#9A9A9C' }}>{list.length} notes</div>
      </div>
      <div style={{ columnCount: columns, columnGap: 10 }}>
        {list.map((n, i) => (
          <NoteCard key={n.title} note={n} clamp={i % 2 === 0 ? 4 : 2} lifted={dragging && i === 1} />
        ))}
      </div>
    </div>
  )
}
