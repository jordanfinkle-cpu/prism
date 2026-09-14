import Fit from './Fit.jsx'
import MacPane from './MacPane.jsx'
import NotesMasonry from './NotesMasonry.jsx'
import ChatThread from './ChatThread.jsx'
import TaskRows from './TaskRows.jsx'
import GraphDots from './GraphDots.jsx'
import { CallFrame } from './CallIsland.jsx'
import { Wave, Disc, Mark } from './parts.jsx'
import { NOTE } from './fixtures.js'
import { motion } from 'motion/react'
import { EASE_OUT_EXPO } from '../lib/motion.js'

/* Mockups as they sit in the page: fixed geometry inside, scaled to the column
   outside. Each one is aria-hidden by Fit and described in prose by the
   chapter that owns it. */

export function NotesShot({ dragging = false }) {
  return (
    <Fit w={1040} h={640}>
      <MacPane w={1040} h={640} dragging={dragging}>
        <NotesMasonry columns={3} dragging={dragging} />
      </MacPane>
    </Fit>
  )
}

export function ChatShot() {
  return (
    <Fit w={1040} h={640}>
      <MacPane w={1040} h={640} active="Chat">
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
          <ChatThread w={680} />
        </div>
      </MacPane>
    </Fit>
  )
}

export function TasksShot() {
  return (
    <Fit w={1040} h={640}>
      <MacPane w={1040} h={640} active="Tasks">
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.012em', color: '#181819', marginBottom: 12 }}>Tasks</div>
        <TaskRows w={740} />
      </MacPane>
    </Fit>
  )
}

export function GraphShot() {
  return (
    <Fit w={1040} h={640}>
      <MacPane w={1040} h={640} active="Graph" padded={false}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <GraphDots w={700} h={470} />
        </div>
      </MacPane>
    </Fit>
  )
}

/* Two channels, drawn as two lanes that meet in one labelled transcript. The
   point of the picture is that the labels are read off the wires, not guessed
   from the sound. */
export function ChannelsShot() {
  const lanes = [
    { who: 'You', sub: 'your microphone', tone: 'green', bars: [0.9, 0.5, 0.75, 1, 0.45, 0.8, 0.35, 0.6, 0.9] },
    { who: 'Them', sub: 'what you hear', tone: 'violet', bars: [0.4, 0.85, 0.6, 0.35, 0.95, 0.5, 0.8, 0.45, 0.7] },
  ]
  return (
    <div style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 620, marginInline: 'auto' }}>
      {lanes.map((l, i) => (
        <motion.div
          key={l.who}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: i * 0.08 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', borderRadius: 18, background: '#fff',
            boxShadow: '0 0 0 1px rgba(24,24,25,.055), 0 1px 3px rgba(24,24,25,.05)',
          }}
        >
          <Disc tone={l.tone} size={30} label={l.who[0]} />
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.012em', color: '#181819' }}>{l.who}</div>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: '#9A9A9C' }}>{l.sub}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Wave height={26} bars={l.bars} />
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.2 }}
        style={{
          padding: '16px 18px', borderRadius: 18, background: '#fff',
          boxShadow: '0 0 0 1px rgba(24,24,25,.055), 0 1px 3px rgba(24,24,25,.05)',
          display: 'grid', gap: 12,
        }}
      >
        {NOTE.transcript.slice(0, 3).map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 10 }}>
            <Disc tone={t.side === 'you' ? 'green' : 'violet'} size={22} label={t.who[0]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 500, color: '#9A9A9C' }}>{t.who}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, color: '#181819' }}>{t.text}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* A desktop for the card to sit on.

   The card is glass on macOS 26: it tints and refracts whatever is behind it,
   which means showing it on a flat ground shows half the thing. So it gets a
   wallpaper, the way it would have on anyone's actual screen. The deep teal
   underneath is the photograph's own water, so nothing flashes white while the
   image loads. */
export function Screen({ children, max = 560 }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: max,
        aspectRatio: '1011 / 711',
        borderRadius: 18,
        overflow: 'hidden',
        background: "#0E3A42 url('/media/desktop.jpg') center / cover no-repeat",
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.14), 0 40px 90px -34px rgba(0,0,0,.8)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {children}
    </div>
  )
}

/* The stacked telling of the detection sequence, used on phones and whenever
   motion is turned down. Same screen, three moments. */
export function CallStrip() {
  const frames = [
    { stage: 0, cap: 'Zoom picks up your mic. Prism asks, once.' },
    { stage: 1, cap: 'You press it. Both sides start recording.' },
    { stage: 2, cap: 'A pill in the corner, until you hang up.' },
  ]
  return (
    <div style={{ display: 'grid', gap: 30, justifyItems: 'center' }}>
      {frames.map((f) => (
        <div key={f.stage} style={{ display: 'grid', gap: 13, justifyItems: 'center', width: '100%' }}>
          <Screen max={420}>
            <CallFrame stage={f.stage} drain={0.38} glass />
          </Screen>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, color: 'var(--tone-ink3)', textAlign: 'center', maxWidth: 280 }}>
            {f.cap}
          </p>
        </div>
      ))}
    </div>
  )
}

export function DictationShot() {
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 9,
        height: 40, padding: '0 13px', borderRadius: 12,
        background: '#181819', color: '#fff',
        boxShadow:
          'inset 0 0 0 .5px rgba(255,255,255,.20), inset 0 1.5px 0 rgba(255,255,255,.14), 0 14px 38px rgba(0,0,0,.22)',
      }}
    >
      <Mark size={11} color="#fff" />
      <Wave height={14} color="#fff" />
      <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.58)' }}>Hold to speak</span>
    </div>
  )
}
