import { Mark, FolderGlyph, Disc } from './parts.jsx'
import { FOLDERS } from './fixtures.js'

const RAIL_W = 212
const ITEMS = [
  { label: 'All notes', icon: 'notes' },
  { label: 'Tasks', icon: 'tasks' },
  { label: 'Chat', icon: 'chat' },
  { label: 'Dictation', icon: 'dictation' },
  { label: 'Graph', icon: 'graph' },
]

function Icon({ name, size = 15 }) {
  const s = { width: size, height: size, flex: 'none', display: 'block' }
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'notes':
      return <svg viewBox="0 0 16 16" style={s} aria-hidden="true"><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" {...stroke} /><path d="M5.4 6.3h5.2M5.4 9.2h3.4" {...stroke} /></svg>
    case 'tasks':
      return <svg viewBox="0 0 16 16" style={s} aria-hidden="true"><path d="M3 5.6l1.6 1.6L7.6 4M3 11.1l1.6 1.6L7.6 9.5M9.8 6h3.4M9.8 11.4h3.4" {...stroke} /></svg>
    case 'chat':
      return <svg viewBox="0 0 16 16" style={s} aria-hidden="true"><path d="M13.3 8.2c0 2.5-2.3 4.5-5.2 4.5-.7 0-1.4-.1-2-.3l-3 1 .9-2.4A4.3 4.3 0 0 1 2.7 8.2c0-2.5 2.3-4.5 5.3-4.5s5.3 2 5.3 4.5Z" {...stroke} /></svg>
    case 'dictation':
      return <svg viewBox="0 0 16 16" style={s} aria-hidden="true"><rect x="6" y="2.4" width="4" height="7" rx="2" {...stroke} /><path d="M3.8 7.6a4.2 4.2 0 0 0 8.4 0M8 11.8v1.8" {...stroke} /></svg>
    default:
      return <svg viewBox="0 0 16 16" style={s} aria-hidden="true"><circle cx="4.2" cy="4.6" r="1.7" {...stroke} /><circle cx="11.6" cy="6.6" r="1.7" {...stroke} /><circle cx="6.4" cy="11.8" r="1.7" {...stroke} /><path d="M5.7 5.4l4.3 1M5.6 10.4l4.7-2.4" {...stroke} /></svg>
  }
}

export function Rail({ active = 'All notes', dragging = false }) {
  return (
    <aside
      style={{
        width: RAIL_W,
        flex: 'none',
        padding: 11,
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingInline: 4, height: 26, color: '#181819' }}>
        <Mark size={15} />
        <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.015em' }}>Prism</span>
      </div>

      <div
        style={{
          height: 34,
          borderRadius: 10,
          background: '#EBEBEC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: 10,
          fontSize: 12.5,
          fontWeight: 500,
          color: '#9A9A9C',
        }}
      >
        <span>Search</span>
        <span style={{ fontSize: 11 }}>⌃K</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {ITEMS.map((it) => {
          const on = it.label === active
          return (
            <div
              key={it.label}
              style={{
                height: 33,
                borderRadius: 8,
                paddingInline: 9,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontSize: 13.5,
                fontWeight: 500,
                letterSpacing: '-0.008em',
                color: on ? '#181819' : '#6A6A6C',
                background: on ? '#E4E4E6' : 'transparent',
              }}
            >
              <Icon name={it.icon} />
              {it.label}
            </div>
          )
        })}
      </div>

      <div style={{ height: 1, background: 'rgba(24,24,25,.07)', marginInline: 4 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: '#9A9A9C', paddingInline: 9, paddingBlock: 4 }}>
          Folders
        </div>
        {FOLDERS.map((f, i) => (
          <div
            key={f.name}
            style={{
              height: 31,
              borderRadius: 8,
              paddingInline: 9,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontSize: 12.5,
              fontWeight: 500,
              color: '#6A6A6C',
              background: dragging && i === 0 ? '#E4E4E6' : 'transparent',
              boxShadow: dragging && i === 0 ? 'inset 0 0 0 1.5px rgba(10,132,255,.5)' : 'none',
            }}
          >
            <FolderGlyph color={f.color} />
            {f.name}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 9, paddingInline: 5, height: 34 }}>
        <Disc tone="green" size={26} label="J" />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: '#181819' }}>Jordan</div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: '#9A9A9C' }}>jordan@example.com</div>
        </div>
      </div>
    </aside>
  )
}

/* The whole workspace is one rounded sheet floating on the window's chrome —
   the Mac app's own anatomy, not a generic browser frame. */
export default function MacPane({
  w = 1040,
  h = 640,
  active = 'All notes',
  rail = true,
  dragging = false,
  children,
  padded = true,
}) {
  return (
    <div
      className="mock-lift"
      style={{
        width: w,
        height: h,
        borderRadius: 12,
        background: '#EBEBEC',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ height: 28, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, paddingInline: 13 }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: 999, background: c }} />
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, paddingInline: 3, paddingBottom: 3 }}>
        {rail && <Rail active={active} dragging={dragging} />}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            borderRadius: 14,
            background: '#F4F4F5',
            boxShadow: '0 0 0 1px rgba(24,24,25,.055), 0 1px 3px rgba(24,24,25,.04)',
            overflow: 'hidden',
            padding: padded ? '18px 20px' : 0,
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
