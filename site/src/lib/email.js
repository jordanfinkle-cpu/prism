/* Shape check only, mirroring prism_request_access in early_access_setup.sql.
   Anything cleverer rejects real addresses; the invite mail bouncing is the
   real check. */
const SHAPE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function normalize(raw) {
  return String(raw ?? '').trim().toLowerCase()
}

export function looksLikeEmail(raw) {
  const e = normalize(raw)
  return e.length > 0 && e.length <= 254 && SHAPE.test(e)
}
