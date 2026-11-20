import { useEffect, useRef, useState } from 'react'

/* Scales a fixed-size mockup down to whatever width it is given.

   The alternative — letting the mockup reflow — would misstate the product:
   every measurement in these components is lifted from the running app, and a
   reflowed 1040px window is a picture of a window that does not exist. So the
   geometry stays exact and the whole thing shrinks, the way a photograph
   would. Never scaled above 1: a blown-up screenshot looks like a mistake.

   The wrapper reserves h * k so nothing below it shifts when the scale
   settles, which keeps CLS at zero. */
export default function Fit({ w, h, children, align = 'center', className, style }) {
  const boxRef = useRef(null)
  const [k, setK] = useState(1)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const avail = entry.contentRect.width
      if (avail > 0) setK(Math.min(1, avail / w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [w])

  return (
    <div
      ref={boxRef}
      className={className}
      style={{ width: '100%', height: h * k, position: 'relative', ...style }}
      aria-hidden="true"
    >
      <div
        style={{
          width: w,
          height: h,
          transform: `scale(${k})`,
          transformOrigin: align === 'left' ? 'top left' : 'top center',
          position: 'absolute',
          top: 0,
          left: align === 'left' ? 0 : '50%',
          marginLeft: align === 'left' ? 0 : -w / 2,
        }}
      >
        {children}
      </div>
    </div>
  )
}
