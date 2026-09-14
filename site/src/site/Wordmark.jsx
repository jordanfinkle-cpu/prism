/* The Prism mark — the chevron asterisk with exploded arms (v2), adopted 2026-08-18.

   OVERRIDES THE DESIGN SYSTEM'S Wordmark ON PURPOSE. The vendored bundle still draws the older
   asterisk (one path, viewBox 1462x1382) because the design project has not been re-cut yet,
   and prism-ds.js is re-downloaded wholesale on every sync — anything patched in there would
   be silently undone. So the mark lives here, the DS component is simply not imported, and
   when the design project catches up this file can go away. Re-cutting it upstream is what
   actually ends the override.

   Same props as the DS Wordmark (size, showName, color, src, style) so it drops straight in.

   ON SMALL SIZES. v2 has air between the chevron and the five arms, and below roughly 12px
   that air closes and the mark reads as a speck. Everywhere the site draws it today is 9–16px,
   so this is the trade being made knowingly, not an oversight: the mark is more distinctive
   where anyone looks at it properly, and busier in the nav. If the nav or the browser tab ever
   looks muddy, the fix is an optical size — v1's connected star below ~14px — not a redraw. */
import React from 'react'

/* Straight from mark_v3.svg, viewBox 0 0 1000 1000. Square, where the old mark was slightly
   wider than tall — anything sizing it by width alone needs checking, not just swapping. */
export const MARK_PATHS = [
  /* chevron */
  'M194.176 98.717L98.717 194.176L337.041 432.5L0 432.5L0 567.5L337.041 567.5L98.717 805.824L194.176 901.283L565.195 530.264A42.8 42.8 0 0 0 565.195 469.736Z',
  /* star — one connected piece, wide notch around the chevron */
  'M432.5 0L567.5 0L567.5 337.041L805.824 98.717L901.283 194.176L662.959 432.5L1000 432.5L1000 567.5L662.959 567.5L901.283 805.824L805.824 901.283L567.5 662.959L567.5 1000L432.5 1000L432.5 783.592L625.511 590.58A128.1 128.1 0 0 0 625.511 409.42L432.5 216.408Z',
]

export function Mark({ className = 'mark' }) {
  return (
    <svg className={className} viewBox="0 0 1000 1000" aria-hidden="true">
      {MARK_PATHS.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export default function Wordmark({
  size = 17,
  showName = true,
  color = 'var(--ink)',
  src,
  style,
  ...rest
}) {
  const mark = Math.round(size * 0.82);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.4), color, ...style }} {...rest}>
      {src ? (
        <img src={src} alt="" aria-hidden="true" style={{ height: mark, width: 'auto', display: 'block' }} />
      ) : (
        <svg viewBox="0 0 1000 1000" role="img" aria-label="Prism" fill="currentColor"
          style={{ height: mark, width: mark, display: 'block', flex: '0 0 auto' }}>
          {MARK_PATHS.map((d, i) => <path key={i} d={d} />)}
        </svg>
      )}
      {showName && (
        <span style={{
          font: 'var(--weight-semibold) ' + size + 'px/1 var(--font-display)',
          letterSpacing: 'var(--tracking-title)', color,
        }}>Prism</span>
      )}
    </span>
  );
}
