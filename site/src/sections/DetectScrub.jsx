import { motion, useTransform } from 'motion/react'
import Pinned from '../components/Pinned.jsx'
import CallIsland from '../mockups/CallIsland.jsx'
import { CallStrip } from '../mockups/shots.jsx'
import { EASE_OUT_EXPO } from '../lib/motion.js'

/* Chapter 7: the card notices, you decide.

   Scrolling drives one box through detect → confirm → recording pill, and
   then out toward the corner of the screen where it actually lives. The
   button press at 42% is the whole point: the sequence cannot advance past
   it without you. */

const CAPS = [
  { at: [0, 0.28], text: 'Zoom picks up your mic. Prism asks, once.' },
  { at: [0.42, 0.6], text: 'You press it. Both sides start recording.' },
  { at: [0.78, 1], text: 'A pill in the corner, until you hang up.' },
]

/* Scroll progress only ever runs 0…1, and a keyframe list that steps outside
   that — or repeats a stop — is rejected outright. Build the fade window by
   clamping, and nudge any collision so the list stays strictly increasing. */
function window4(from, to, pad = 0.06) {
  const a = Math.max(0, from - pad)
  const b = Math.min(1, to + pad)
  const stops = [a, from, to, b]
  for (let i = 1; i < stops.length; i++) {
    if (stops[i] <= stops[i - 1]) stops[i] = Math.min(1, stops[i - 1] + 0.001)
  }
  return stops
}

function Cap({ progress, at, text }) {
  const stops = window4(at[0], at[1])
  const opacity = useTransform(progress, stops, [0, 1, 1, 0])
  const y = useTransform(progress, [stops[0], stops[1]], [10, 0])
  return (
    <motion.p className="ds-cap" style={{ opacity, y }}>
      {text}
    </motion.p>
  )
}

function Stage({ progress }) {
  return (
    <div className="ds-stage">
      <div className="ds-copy">
        <p className="t-eyebrow">Meeting detection</p>
        <h2 className="t-h2 ds-h2">The meeting starts. Prism asks once.</h2>
        <p className="t-lede ds-lede">
          When Zoom, Teams or Meet pick up your mic, a small card offers to start
          recording. Nothing records unless you press it.
        </p>
        <p className="t-body ds-note">
          Connect Outlook or a calendar link and the note is named after the meeting
          before it has finished.
        </p>
      </div>

      <div className="ds-shot">
        <div className="ds-island">
          <CallIsland progress={progress} />
        </div>
        <div className="ds-caps">
          {CAPS.map((c) => (
            <Cap key={c.text} progress={progress} {...c} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Flat() {
  return (
    <div className="ds-flat">
      <p className="t-eyebrow">Meeting detection</p>
      <h2 className="t-h2 ds-h2">The meeting starts. Prism asks once.</h2>
      <p className="t-lede ds-lede">
        When Zoom, Teams or Meet pick up your mic, a small card offers to start
        recording. Nothing records unless you press it.
      </p>
      <div style={{ marginTop: 44 }}>
        <CallStrip />
      </div>
    </div>
  )
}

export default function DetectScrub() {
  return (
    <>
      <Pinned vh={280} fallback={<Flat />} className="ds">
        {(progress) => <Stage progress={progress} />}
      </Pinned>
      <style>{`
        .ds { padding-inline: var(--gutter); }
        .ds-stage {
          width: 100%;
          max-width: 1440px;
          margin-inline: auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(32px, 5vw, 72px);
          align-items: center;
        }
        .ds-h2 { margin-top: 18px; }
        .ds-lede { margin-top: 22px; }
        .ds-note { margin-top: 18px; max-width: 40ch; }
        .ds-shot {
          display: grid;
          justify-items: center;
          gap: 34px;
        }
        .ds-island { display: grid; place-items: center; min-height: 170px; }
        .ds-caps { position: relative; width: 100%; min-height: 48px; }
        .ds-cap {
          position: absolute;
          inset: 0;
          margin: 0;
          text-align: center;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--tone-ink2);
        }
        .ds-flat { padding-block: 64px; }
        @media (max-width: 1023px) {
          .ds-stage { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
