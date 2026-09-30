import { ACCENTS, DISC } from './fixtures.js'

/* Small pieces the mockups share. Everything here is sized in app pixels and
   never scales with the page — a product shot that reflows is not a product
   shot. `Fit` below is what makes them fit the layout instead. */

export function Mark({ size = 15, color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 1000 1000" width={size} height={size} fill={color} aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      <path d="M194.176 98.717L98.717 194.176L337.041 432.5L0 432.5L0 567.5L337.041 567.5L98.717 805.824L194.176 901.283L565.195 530.264A42.8 42.8 0 0 0 565.195 469.736Z" />
      <path d="M432.5 0L567.5 0L567.5 337.041L805.824 98.717L901.283 194.176L662.959 432.5L1000 432.5L1000 567.5L662.959 567.5L901.283 805.824L805.824 901.283L567.5 662.959L567.5 1000L432.5 1000L432.5 783.592L625.511 590.58A128.1 128.1 0 0 0 625.511 409.42L432.5 216.408Z" />
    </svg>
  )
}

/* Nine bars, 3px wide and 3px apart, running 3px to 14px.

   Each one is a slice of the spectrum rather than a slice of the loudness, and
   the app puts bass in the middle, so the shape tapers out to the ends. At rest
   every bar is exactly 3px — a row of perfect circles, which reads as listening
   rather than as broken. The pattern is fixed so two renders match. */
const BARS = [0.3, 0.55, 0.78, 0.95, 0.86, 1, 0.72, 0.48, 0.28]

export function Wave({ height = 16, color = '#181819', level = 1, bars = BARS }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3, height }} aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          style={{
            width: 3,
            borderRadius: 999,
            background: color,
            height: Math.max(3, Math.round(height * h * level)),
            transition: 'height .18s linear',
          }}
        />
      ))}
    </span>
  )
}

/* A folder tag: 10% tint, no ring, a 7px dot. On dark the tint has to carry
   more weight to survive, which is what the app's own dark branch does. */
export function FolderTag({ name, color = 'blue', dark = false, style }) {
  const hex = ACCENTS[color] ?? ACCENTS.blue
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 22,
        paddingInline: 9,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '-0.005em',
        background: `color-mix(in srgb, ${hex} ${dark ? 16 : 10}%, transparent)`,
        color: dark ? `color-mix(in srgb, ${hex} 80%, #fff)` : `color-mix(in srgb, ${hex} 78%, #000)`,
        ...style,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 999, background: hex, flex: 'none' }} />
      {name}
    </span>
  )
}

export function Disc({ tone = 'blue', size = 26, label }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: DISC[tone] ?? DISC.blue,
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        fontSize: Math.round(size * 0.42),
        fontWeight: 600,
      }}
      aria-hidden="true"
    >
      {label}
    </span>
  )
}

export function Check({ on = false, color = '#181819', size = 20 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: on ? color : 'transparent',
        boxShadow: on ? 'none' : 'inset 0 0 0 1.5px rgba(24,24,25,.22)',
        transition: 'background .14s ease, box-shadow .14s ease',
      }}
      aria-hidden="true"
    >
      {on && (
        <svg viewBox="0 0 20 20" width={size * 0.62} height={size * 0.62}>
          <path d="M5 10.3l3.3 3.3L15 6.9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

export function FolderGlyph({ color = 'blue', size = 15 }) {
  const hex = ACCENTS[color] ?? ACCENTS.blue
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" style={{ flex: 'none' }}>
      <path
        d="M1.6 4.2c0-.8.6-1.4 1.4-1.4h2.6c.4 0 .8.2 1.1.5l.8.9h5c.8 0 1.4.6 1.4 1.4v6.2c0 .8-.6 1.4-1.4 1.4H3c-.8 0-1.4-.6-1.4-1.4z"
        fill={hex}
        opacity="0.92"
      />
    </svg>
  )
}
