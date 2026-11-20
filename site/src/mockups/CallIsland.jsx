import { motion, useTransform } from 'motion/react'
import { Mark, Wave } from './parts.jsx'

/* The meeting card, as the app actually draws it.

   Ported from the Prism meeting-card spec, which is itself
   win-lite/web/meeting_popup.html and mac/Sources/PrismMac/PopupController.swift.
   It is ink with white text in every state and deliberately does not follow the
   system appearance, which is why it stays dark here even on a light chapter.

     detect   236 x 136, r16   asks once
     confirm  238 x  58, r14   acknowledges, held 1.9s from the click
     live     161 x  40, r12   the pill, with the wave and the elapsed clock

   The countdown is a ring drawn on the dismiss control, not a bar under the
   button: it belongs on the control that does the same thing running out does,
   rather than on the one that does the opposite. */

export const STAGES = [
  { w: 236, h: 136, r: 16 },
  { w: 238, h: 58, r: 14 },
  { w: 161, h: 40, r: 12 },
]

const INK = '#181819'
const REC = '#FF453A'

/* Two finishes, both of them the product.

   Flat is the card on Windows and on macOS before 26: solid ink, a white
   button, secondary text at .58 and .38.

   Glass is what macOS 26 draws — the card is a tint over live refraction of
   whatever is behind it, so it only makes sense somewhere there is something
   behind it to refract. Its secondary text runs .82 and .62 instead: over a lit
   white surface the flat values fell to 2.9:1, and AA wants 4.5. */
function theme(glass) {
  return glass
    ? {
        shell: {
          background: 'rgba(24,24,25,.58)',
          backdropFilter: 'blur(15px) saturate(200%) brightness(1.12)',
          WebkitBackdropFilter: 'blur(15px) saturate(200%) brightness(1.12)',
          color: '#fff',
          boxShadow:
            'inset 0 0 0 .5px rgba(255,255,255,.20), inset 0 1.5px 0 rgba(255,255,255,.26), 0 18px 46px rgba(0,0,0,.34)',
        },
        s2: 'rgba(255,255,255,.82)',
        s3: 'rgba(255,255,255,.62)',
        btn: { background: 'rgba(255,255,255,.2)', color: '#fff', boxShadow: 'inset 0 .5px 0 rgba(255,255,255,.45)' },
        disc: 'rgba(255,255,255,.92)',
        stopBg: 'rgba(255,255,255,.12)',
      }
    : {
        shell: {
          background: INK,
          color: '#fff',
          boxShadow:
            'inset 0 0 0 .5px rgba(255,255,255,.20), inset 0 1.5px 0 rgba(255,255,255,.14), 0 14px 38px rgba(0,0,0,.42)',
        },
        s2: 'rgba(255,255,255,.58)',
        s3: 'rgba(255,255,255,.38)',
        btn: { background: '#fff', color: '#0B0B0C' },
        disc: '#fff',
        stopBg: INK,
      }
}

/* r 9.25 in a 22px box, so the circumference is 58.12 — that is the dash array,
   and the offset runs the full length across the window. Rotated to start at
   twelve o'clock. */
const RING_LEN = 58.12

function ringParts(t, Circle, extra) {
  return (
    <svg viewBox="0 0 22 22" width={22} height={22} aria-hidden="true" style={{ display: 'block' }}>
      <circle cx="11" cy="11" r="9.25" fill="none" strokeWidth="1.25" stroke="rgba(255,255,255,.08)" />
      <Circle
        cx="11"
        cy="11"
        r="9.25"
        fill="none"
        strokeWidth="1.25"
        stroke={t.s3}
        strokeLinecap="round"
        strokeDasharray={RING_LEN}
        transform="rotate(-90 11 11)"
        {...extra}
      />
      <path d="M8.4 8.4 13.6 13.6M13.6 8.4 8.4 13.6" fill="none" stroke={t.s3} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

const Ring = ({ t, drain = 0.38 }) => ringParts(t, 'circle', { strokeDashoffset: RING_LEN * drain })
const ScrubRing = ({ t, offset }) => ringParts(t, motion.circle, { style: { strokeDashoffset: offset } })

function DetectBody({ ring, t }) {
  return (
    <div style={{ padding: '11px 13px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Mark size={11} color="#fff" />
        <b style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.008em' }}>Prism</b>
        <span style={{ marginLeft: 'auto', width: 22, height: 22, display: 'grid', placeItems: 'center' }}>{ring}</span>
      </div>

      <div style={{ marginTop: 7, fontSize: 15, fontWeight: 700, letterSpacing: '-0.016em' }}>
        Meeting detected
        <i style={{ fontStyle: 'normal', fontSize: 11.5, fontWeight: 500, color: t.s3, marginLeft: 6 }}>now</i>
      </div>
      <div
        style={{
          fontSize: 12.5, fontWeight: 500, color: t.s2, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}
      >
        Zoom meeting just started.
      </div>

      <div
        style={{
          marginTop: 11, width: '100%', height: 38, borderRadius: 999,
          fontSize: 13, fontWeight: 600, letterSpacing: '-0.008em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          ...t.btn,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 999, background: REC }} />
        Start recording
      </div>
    </div>
  )
}

function ConfirmBody({ t }) {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 13px', boxSizing: 'border-box' }}>
      <span
        style={{
          width: 30, height: 30, flex: 'none', borderRadius: 999,
          background: t.disc, display: 'grid', placeItems: 'center', color: '#0B0B0C',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12.5 4.6 4.6L19 7.5" />
        </svg>
      </span>
      <span style={{ lineHeight: 1.3 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.014em' }}>Recording this meeting</span>
        <br />
        <span style={{ fontSize: 12, fontWeight: 500, color: t.s2 }}>Got it — capturing the call.</span>
      </span>
    </div>
  )
}

function LiveBody({ timer = '0:00', level = 1, t }) {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '0 9px 0 12px', boxSizing: 'border-box' }}>
      <Mark size={11} color="#fff" />
      <Wave height={14} level={level} color="#fff" />
      <span className="tabular" style={{ fontSize: 12, fontWeight: 500, color: t.s2 }}>
        {timer}
      </span>
      <span
        style={{
          width: 24, height: 24, flex: 'none', marginLeft: 'auto', borderRadius: 999,
          border: `1.5px solid ${REC}`, background: t.stopBg,
          display: 'grid', placeItems: 'center', boxSizing: 'border-box',
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 2.5, background: REC }} />
      </span>
    </div>
  )
}

/* Static frame, for the stacked telling on phones and for posters. */
export function CallFrame({ stage = 0, drain = 0.38, timer = '4:17', glass = false }) {
  const s = STAGES[stage]
  const t = theme(glass)
  return (
    <div style={{ width: s.w, height: s.h, borderRadius: s.r, overflow: 'hidden', ...t.shell }}>
      {stage === 0 ? (
        <DetectBody t={t} ring={<Ring t={t} drain={drain} />} />
      ) : stage === 1 ? (
        <ConfirmBody t={t} />
      ) : (
        <LiveBody t={t} timer={timer} />
      )}
    </div>
  )
}

/* Scrubbed: one box whose size and contents follow a 0…1 progress value.

   The states cross-fade while the box resizes, overlapping just enough that
   there is always ink in it. Separating them completely left a beat where a
   near-full-size card was simply empty, which reads as a fault. */
export default function CallIsland({ progress, glass = false }) {
  const t = theme(glass)
  const SIZE = [0, 0.32, 0.46, 0.62, 0.76]
  const width = useTransform(progress, SIZE, [236, 236, 238, 238, 161])
  const height = useTransform(progress, SIZE, [136, 136, 58, 58, 40])
  const radius = useTransform(progress, SIZE, [16, 16, 14, 14, 12])
  const x = useTransform(progress, [0.86, 1], [0, 96])
  const y = useTransform(progress, [0.86, 1], [0, -64])

  const detectOpacity = useTransform(progress, [0.3, 0.42], [1, 0])
  const confirmOpacity = useTransform(progress, [0.36, 0.46, 0.6, 0.7], [0, 1, 1, 0])
  const liveOpacity = useTransform(progress, [0.66, 0.78], [0, 1])
  const ringOffset = useTransform(progress, [0.04, 0.3], [0, RING_LEN])
  const pressScale = useTransform(progress, [0.22, 0.25, 0.29], [1, 0.985, 1])

  return (
    <motion.div style={{ x, y, scale: pressScale }}>
      <motion.div style={{ width, height, borderRadius: radius, overflow: 'hidden', position: 'relative', ...t.shell }}>
        <motion.div style={{ opacity: detectOpacity, position: 'absolute', inset: 0, width: 236, height: 136 }}>
          <DetectBody t={t} ring={<ScrubRing t={t} offset={ringOffset} />} />
        </motion.div>
        <motion.div style={{ opacity: confirmOpacity, position: 'absolute', inset: 0 }}>
          <ConfirmBody t={t} />
        </motion.div>
        <motion.div style={{ opacity: liveOpacity, position: 'absolute', inset: 0 }}>
          <LiveBody t={t} timer="0:04" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
