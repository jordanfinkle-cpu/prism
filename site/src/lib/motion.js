import { useEffect, useState } from 'react'

/* The app's house curves, as arrays motion can consume directly. */
export const EASE_OUT_EXPO = [0.32, 0.72, 0, 1]

export function useMediaQuery(query) {
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/* Both of these start false on the server and on the first client frame, so a
   component that uses them must render its *static* form first and upgrade to
   motion after mount. That ordering is deliberate: the end state is always the
   safe thing to paint. */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/* True when the page should animate at all. */
export function useAnimated() {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && !reduced
}
