import { motion } from 'motion/react'
import { EASE_OUT_EXPO } from '../lib/motion.js'

/* Enter animation for anything below the fold. Never wrap the hero H1 in this:
   it is the LCP element and must paint opaque on the first frame. */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  blur = true,
  as = 'div',
  className,
  style,
}) {
  const M = motion[as] ?? motion.div
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: blur ? 'blur(6px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.58, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </M>
  )
}
