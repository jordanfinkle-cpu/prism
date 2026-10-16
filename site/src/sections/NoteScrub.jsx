import { motion, useTransform, useMotionValueEvent } from 'motion/react'
import { useState } from 'react'
import Pinned from '../components/Pinned.jsx'
import Fit from '../mockups/Fit.jsx'
import NoteView from '../mockups/NoteView.jsx'
import { EASE_OUT_EXPO } from '../lib/motion.js'

/* Chapter 3 held still: the note turns itself over as the page scrolls past.

   Three panes, one per third of the sequence. The copy on the left changes
   with them, so the reader is always being told what they are looking at. */

const PANES = [
  {
    head: 'A summary you can read before the next call.',
    body: 'What was agreed, what is still open, and the date everything else hangs off.',
  },
  {
    head: 'The action items, as checkboxes.',
    body: 'Who owes what, by when. Yours become tasks; theirs stay on the note so you can ask about them later.',
  },
  {
    head: 'And the transcript underneath.',
    body: 'Two channels, so each line is labelled by where it came from. What you typed during the call stays exactly as you typed it.',
  },
]

function Stage({ progress }) {
  const [tab, setTab] = useState(0)

  const scale = useTransform(progress, [0, 0.15, 0.9, 1], [0.92, 1, 1, 0.98])
  const y = useTransform(progress, [0, 0.15, 0.9, 1], [60, 0, 0, -40])
  const opacity = useTransform(progress, [0, 0.94, 1], [1, 1, 0])

  useMotionValueEvent(progress, 'change', (p) => {
    const next = p < 0.4 ? 0 : p < 0.66 ? 1 : 2
    setTab((cur) => (cur === next ? cur : next))
  })

  return (
    <div className="ns-stage">
      <div className="ns-copy">
        <p className="t-eyebrow">The note</p>
        <h2 className="t-h2 ns-h2">Two parts, one note.</h2>
        <div className="ns-swap">
          {PANES.map((p, i) => (
            <motion.div
              key={i}
              className="ns-pane"
              initial={{ opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 12 }}
              animate={{ opacity: tab === i ? 1 : 0, y: tab === i ? 0 : 12 }}
              transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
              aria-hidden={tab !== i}
            >
              <p className="t-h3 ns-pane-head">{p.head}</p>
              <p className="t-body ns-pane-body">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div className="ns-shot" style={{ scale, y, opacity }}>
        <Fit w={700} h={520} align="left">
          <div
            style={{
              width: 700,
              height: 520,
              background: '#fff',
              borderRadius: 22,
              boxShadow: '0 0 0 1px rgba(24,24,25,.055), 0 40px 100px -24px rgba(24,24,25,.22)',
              padding: '26px 30px',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <NoteView w={640} tab={tab} />
          </div>
        </Fit>
      </motion.div>
    </div>
  )
}

function Flat() {
  return (
    <div className="ns-flat">
      <div className="ns-copy">
        <p className="t-eyebrow">The note</p>
        <h2 className="t-h2 ns-h2">Two parts, one note.</h2>
        <p className="t-lede ns-flat-lede">
          A summary, the decisions, and action items as checkboxes. The transcript sits
          underneath so you can check what was actually said.
        </p>
      </div>
      {PANES.map((p, i) => (
        <div className="ns-flat-block" key={i}>
          <p className="t-h3">{p.head}</p>
          <p className="t-body" style={{ marginTop: 10 }}>{p.body}</p>
          <div style={{ marginTop: 20 }}>
            <Fit w={700} h={520}>
              <div
                style={{
                  width: 700, height: 520, background: '#fff', borderRadius: 22,
                  boxShadow: '0 0 0 1px rgba(24,24,25,.055), 0 20px 50px -18px rgba(24,24,25,.2)',
                  padding: '26px 30px', boxSizing: 'border-box', overflow: 'hidden',
                }}
              >
                <NoteView w={640} tab={i} />
              </div>
            </Fit>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NoteScrub() {
  return (
    <>
      <Pinned vh={320} fallback={<Flat />} className="ns">
        {(progress) => <Stage progress={progress} />}
      </Pinned>
      <style>{`
        .ns { padding-inline: var(--gutter); }
        .ns-stage {
          width: 100%;
          max-width: 1440px;
          margin-inline: auto;
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(0, 1fr);
          gap: clamp(32px, 5vw, 72px);
          align-items: center;
        }
        .ns-h2 { margin-top: 18px; }
        .ns-swap { position: relative; margin-top: 28px; min-height: 190px; }
        .ns-pane { position: absolute; inset: 0; }
        .ns-pane-head { color: var(--tone-ink); }
        .ns-pane-body { margin-top: 12px; max-width: 42ch; }
        .ns-shot { min-width: 0; }

        .ns-flat { padding-block: 64px; display: grid; gap: 44px; }
        .ns-flat-lede { margin-top: 20px; }
        .ns-flat-block { display: grid; }
        @media (max-width: 1023px) {
          .ns-stage { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
