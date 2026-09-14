import { useRef } from 'react'
import { motion, useScroll, useMotionValue } from 'motion/react'
import { useIsMobile, useReducedMotion } from '../lib/motion.js'

/* A chapter that holds still while the page scrolls past it, handing its
   progress (0…1) to the stage inside.

   The wrapper is `vh` tall and the stage is one viewport of it, stuck to the
   top. Scrolling the extra height is what drives the animation — the page
   never stops moving, so this is not scroll-jacking and a flick still works.

   On a phone, and whenever the reader has asked for less motion, none of that
   happens: the wrapper collapses to content height and the stage renders its
   end state (progress pinned at 1), or a `fallback` if the sequence needs to
   be told as stacked frames instead. */
export default function Pinned({ vh = 300, children, fallback, className, id }) {
  const ref = useRef(null)
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()
  const flat = isMobile || reduced

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const still = useMotionValue(1)
  const progress = flat ? still : scrollYProgress

  if (flat && fallback) {
    return (
      <div id={id} className={className} ref={ref}>
        {fallback}
      </div>
    )
  }

  return (
    <div
      id={id}
      ref={ref}
      className={className}
      style={{ height: flat ? 'auto' : `${vh}vh`, position: 'relative' }}
    >
      <motion.div
        style={
          flat
            ? undefined
            : {
                position: 'sticky',
                top: 'var(--nav-h)',
                height: 'calc(100svh - var(--nav-h))',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
              }
        }
      >
        {children(progress, !flat)}
      </motion.div>
    </div>
  )
}
