import { motion, useTransform } from 'motion/react'
import { Mark, Wave } from './parts.jsx'

/* The three shapes the detection card passes through, at the sizes the app
   actually draws them:

     detect   236 × 150, r16   "A meeting just started."
     confirm  238 ×  58, r14   the acknowledgement, held for a beat
     live     177 ×  40, r12   the recording pill, with the timer running

   One box morphs between them. Nothing here starts recording on its own: the
   card asks, and the drain bar is it giving up rather than deciding for you. */

export const STAGES = [
  { w: 236, h: 150, r: 16 },
  { w: 238, h: 58, r: 14 },
  { w: 177, h: 40, r: 12 },
]

const SHADOW = '0 1px 2px rgba(24,24,25,.035), 0 10px 30px rgba(24,24,25,.10)'

function DetectBody({ drain = 1, pressed = false }) {
  return (
    <div style={{ padding: '11px 12px 0', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#181819' }}>
        <Mark size={11} />
        <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em' }}>Prism</span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9A9A9C', lineHeight: 1 }}>✕</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 9 }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.016em', color: '#181819' }}>Meeting detected</span>
        <span style={{ fontSize: 11.5, fontWeight: 500, color: '#9A9A9C' }}>now</span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: '#6A6A6C', marginTop: 3 }}>Zoom meeting just started.</div>

      <div
        style={{
          height: 38,
          marginTop: 'auto',
          marginBottom: 10,
          borderRadius: 10,
          background: '#EEEEEF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: '#181819',
          transform: pressed ? 'scale(.975)' : 'none',
          transition: 'transform .18s cubic-bezier(.34,1.4,.64,1)',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 999, background: '#FF3B30' }} />
        Start recording
      </div>

      <div style={{ height: 3, background: '#F3F3F4', borderRadius: 999, overflow: 'hidden', marginBottom: 9 }}>
        <div style={{ height: '100%', width: `${drain * 100}%`, background: '#C9C9CD', borderRadius: 999 }} />
      </div>
    </div>
  )
}

function ConfirmBody() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 10, paddingInline: 12, boxSizing: 'border-box' }}>
      <span style={{ width: 30, height: 30, borderRadius: 999, background: '#EEEEEF', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
          <path d="M5 10.3l3.3 3.3L15 6.9" fill="none" stroke="#181819" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div style={{ lineHeight: 1.25 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.012em', color: '#181819' }}>Recording</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#6A6A6C' }}>Both sides, from this Mac.</div>
      </div>
    </div>
  )
}

function LiveBody({ timer = '00:04', level = 1 }) {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 9, paddingInline: 11, boxSizing: 'border-box' }}>
      <Mark size={11} color="#181819" />
      <Wave height={14} level={level} />
      <span className="tabular" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', color: '#181819', marginLeft: 'auto' }}>
        {timer}
      </span>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          boxShadow: 'inset 0 0 0 1.5px #FF3B30',
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 2.5, background: '#FF3B30' }} />
      </span>
    </div>
  )
}

/* Static frame, for the stacked mobile telling and for posters. */
export function CallFrame({ stage = 0, drain = 1, timer = '00:04' }) {
  const s = STAGES[stage]
  return (
    <div
      style={{
        width: s.w,
        height: s.h,
        borderRadius: s.r,
        background: '#fff',
        boxShadow: SHADOW,
        overflow: 'hidden',
      }}
    >
      {stage === 0 ? <DetectBody drain={drain} /> : stage === 1 ? <ConfirmBody /> : <LiveBody timer={timer} />}
    </div>
  )
}

/* Scrubbed version: one box whose size is driven by a 0…1 progress value. */
export default function CallIsland({ progress }) {
  /* The box only ever changes size while whichever body it is holding has
     already faded out, so the reader never sees two states at once. */
  const width = useTransform(progress, [0, 0.33, 0.45, 0.66, 0.78], [236, 236, 238, 238, 177])
  const height = useTransform(progress, [0, 0.33, 0.45, 0.66, 0.78], [150, 150, 58, 58, 40])
  const radius = useTransform(progress, [0, 0.33, 0.45, 0.66, 0.78], [16, 16, 14, 14, 12])
  const x = useTransform(progress, [0.86, 1], [0, 96])
  const y = useTransform(progress, [0.86, 1], [0, -64])

  const detectOpacity = useTransform(progress, [0.28, 0.33], [1, 0])
  const confirmOpacity = useTransform(progress, [0.45, 0.5, 0.62, 0.66], [0, 1, 1, 0])
  const liveOpacity = useTransform(progress, [0.78, 0.84], [0, 1])
  const drain = useTransform(progress, [0.04, 0.24], [1, 0.42])
  const pressScale = useTransform(progress, [0.23, 0.26, 0.3], [1, 0.975, 1])

  return (
    <motion.div style={{ x, y, scale: pressScale }}>
      <motion.div
        style={{
          width,
          height,
          borderRadius: radius,
          background: '#fff',
          boxShadow: SHADOW,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div style={{ opacity: detectOpacity, position: 'absolute', inset: 0, width: 236, height: 150 }}>
          <DetectBodyScrubbed drain={drain} />
        </motion.div>
        <motion.div style={{ opacity: confirmOpacity, position: 'absolute', inset: 0 }}>
          <ConfirmBody />
        </motion.div>
        <motion.div style={{ opacity: liveOpacity, position: 'absolute', inset: 0 }}>
          <LiveBody timer="00:04" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function DetectBodyScrubbed({ drain }) {
  const width = useTransform(drain, (d) => `${d * 100}%`)
  return (
    <div style={{ padding: '11px 12px 0', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#181819' }}>
        <Mark size={11} />
        <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em' }}>Prism</span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9A9A9C', lineHeight: 1 }}>✕</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 9 }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.016em', color: '#181819' }}>Meeting detected</span>
        <span style={{ fontSize: 11.5, fontWeight: 500, color: '#9A9A9C' }}>now</span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: '#6A6A6C', marginTop: 3 }}>Zoom meeting just started.</div>
      <div
        style={{
          height: 38, marginTop: 'auto', marginBottom: 10, borderRadius: 10, background: '#EEEEEF',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', color: '#181819',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 999, background: '#FF3B30' }} />
        Start recording
      </div>
      <div style={{ height: 3, background: '#F3F3F4', borderRadius: 999, overflow: 'hidden', marginBottom: 9 }}>
        <motion.div style={{ height: '100%', width, background: '#C9C9CD', borderRadius: 999 }} />
      </div>
    </div>
  )
}
