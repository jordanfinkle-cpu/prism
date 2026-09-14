import { useEffect, useRef, useState } from 'react'
import MacPane from './MacPane.jsx'
import NotesMasonry from './NotesMasonry.jsx'
import NoteView from './NoteView.jsx'
import { Mark, Wave, FolderTag } from './parts.jsx'
import { NOTE } from './fixtures.js'
import { useAnimated } from '../lib/motion.js'

/* Nine seconds: a call ends and the note writes itself.

   The whole argument for the product is in this loop, so it is timed rather
   than scrubbed — the reader should not have to do anything to see it. It
   holds on the finished note for two and a half seconds before restarting,
   which is long enough to read the first line.

   Before mount, and whenever the reader has asked for less motion, it renders
   the last frame instead. That frame is the point anyway. */

const LOOP = 9.0
const T = {
  press: 2.4,
  pillOut: 3.0,
  noteIn: 3.05,
  title: 3.6,
  summaryFrom: 4.0,
  summaryStep: 0.36,
  actions: 5.4,
  tag: 6.2,
  fade: 8.6,
}

const clamp01 = (n) => Math.min(1, Math.max(0, n))
const ease = (t) => 1 - Math.pow(1 - clamp01(t), 3)

function timerAt(t) {
  const secs = 41 * 60 + 12 + Math.floor(Math.min(t, T.press))
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  return `${m}:${s}`
}

/* The recording pill: the live state of the meeting card, at the size and in
   the colours the app draws it — ink with white text, whatever is behind it. */
function Pill({ t }) {
  const pressed = t >= T.press && t < T.press + 0.18
  const collapse = ease((t - T.press) / 0.58)
  const w = t < T.press ? 161 : 161 - (161 - 40) * collapse
  const out = t >= T.pillOut ? clamp01((t - T.pillOut) / 0.26) : 0
  const level = 0.55 + 0.45 * Math.abs(Math.sin(t * 3.1))

  return (
    <div
      style={{
        width: w,
        height: 40,
        borderRadius: 12,
        background: '#181819',
        color: '#fff',
        boxShadow:
          'inset 0 0 0 .5px rgba(255,255,255,.20), inset 0 1.5px 0 rgba(255,255,255,.14), 0 14px 38px rgba(0,0,0,.28)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 9px 0 12px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: 1 - out,
        transform: `translateY(${-12 * out}px) scale(${pressed ? 0.985 : 1})`,
      }}
    >
      <Mark size={11} color="#fff" />
      <div style={{ opacity: clamp01(1 - collapse * 2.2), display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        <Wave height={14} level={t < T.press ? level : 0.2} color="#fff" />
        <span className="tabular" style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.58)' }}>
          {timerAt(t)}
        </span>
        <span
          style={{
            width: 24, height: 24, borderRadius: 999, flex: 'none', marginLeft: 'auto',
            border: '1.5px solid #FF453A', background: '#181819',
            display: 'grid', placeItems: 'center', boxSizing: 'border-box',
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: 2.5, background: '#FF453A' }} />
        </span>
      </div>
    </div>
  )
}

function WritingNote({ t }) {
  const inP = ease((t - T.noteIn) / 0.5)
  const titleP = ease((t - T.title) / 0.32)
  const lines = Math.max(0, Math.min(NOTE.summary.length, Math.floor((t - T.summaryFrom) / T.summaryStep) + 1))
  const skeleton = t < T.summaryFrom
  const showActions = t >= T.actions
  const tagP = ease((t - T.tag) / 0.32)

  return (
    <div style={{ opacity: inP, transform: `scale(${0.96 + 0.04 * inP})`, transformOrigin: 'top left' }}>
      <div style={{ opacity: clamp01((t - T.noteIn) / 0.3), fontSize: 12, fontWeight: 500, color: '#9A9A9C' }}>{NOTE.date}</div>
      <h3
        style={{
          margin: '7px 0 0',
          fontSize: 30, fontWeight: 500, letterSpacing: '-0.028em', lineHeight: 1.1, color: '#181819',
          opacity: titleP, transform: `translateY(${8 * (1 - titleP)}px)`,
        }}
      >
        {NOTE.title}
      </h3>
      <div style={{ marginTop: 11, opacity: tagP, height: 22 }}>
        <FolderTag name={NOTE.folder} color={NOTE.color} />
      </div>

      <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
        {skeleton
          ? ['92%', '78%', '86%', '61%', '70%'].map((wd, i) => (
              <div key={i} style={{ height: 12, borderRadius: 6, background: '#EBEBEC', width: wd }} />
            ))
          : NOTE.summary.slice(0, lines).map((p, i) => {
              const at = T.summaryFrom + i * T.summaryStep
              const o = ease((t - at) / 0.26)
              return (
                <p key={i} style={{ margin: 0, fontSize: 15.5, lineHeight: 1.62, color: '#181819', opacity: o }}>
                  {p}
                </p>
              )
            })}
      </div>

      {showActions && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#9A9A9C', marginBottom: 4 }}>My action items</div>
          {NOTE.actions.map((a, i) => {
            const at = T.actions + i * 0.12
            const o = ease((t - at) / 0.3)
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11, paddingBlock: 9,
                  borderBottom: '1px solid rgba(24,24,25,.07)',
                  opacity: o, transform: `translateX(${-8 * (1 - o)}px)`,
                }}
              >
                <span style={{ width: 18, height: 18, borderRadius: 999, boxShadow: 'inset 0 0 0 1.5px rgba(24,24,25,.22)', flex: 'none' }} />
                <span style={{ fontSize: 14.5, lineHeight: 1.4, color: '#181819' }}>{a.text}</span>
                <span className="tabular" style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: '#9A9A9C' }}>{a.due}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Frame({ t }) {
  const recording = t < T.pillOut
  const fade = t >= T.fade ? clamp01((t - T.fade) / 0.4) : 0
  return (
    <div style={{ opacity: 1 - fade * 0.85 }}>
      <MacPane w={1040} h={640} active={recording ? 'All notes' : 'All notes'}>
        <div style={{ position: 'absolute', inset: 0, padding: '18px 20px', overflow: 'hidden' }}>
          {recording ? <NotesMasonry columns={3} count={6} /> : <WritingNote t={t} />}
        </div>
        {recording && (
          <div style={{ position: 'absolute', right: 22, bottom: 20 }}>
            <Pill t={t} />
          </div>
        )}
      </MacPane>
    </div>
  )
}

export default function HeroLoop() {
  const animated = useAnimated()
  const [t, setT] = useState(T.fade - 0.4) // the finished note, for the first paint
  const raf = useRef(0)

  /* A plain frame loop rather than the animation library's: this is the only
     timed thing above the fold, and keeping it dependency-free means the hero
     island ships without the 39 KB the scroll sequences need. */
  useEffect(() => {
    if (!animated) return
    let start = 0
    const step = (now) => {
      if (!start) start = now
      setT(((now - start) / 1000) % LOOP)
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [animated])

  return <Frame t={animated ? t : T.fade - 0.4} />
}
