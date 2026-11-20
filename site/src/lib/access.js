import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from 'astro:env/client'
import { normalize } from './email.js'

/* The only network call this site makes.

   The publishable key grants nothing on its own: prism_waitlist has RLS enabled
   with zero policies, so it is unreachable except through prism_request_access —
   a SECURITY DEFINER function that can insert and cannot read. Anyone holding
   this key can add an address to the list and cannot see a single one.
   See supabase/early_access_setup.sql in the prism-aai repo. */

export async function requestAccess(email, source = 'site') {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 12_000)
  try {
    const r = await fetch(PUBLIC_SUPABASE_URL + '/rest/v1/rpc/prism_request_access', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        apikey: PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        Authorization: 'Bearer ' + PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_email: normalize(email), p_source: source }),
    })
    if (!r.ok) {
      return { ok: false, error: 'Something went wrong on our end. Try again in a moment.' }
    }
    const data = await r.json()
    /* The function reports success for an address already on the list, deliberately —
       whether someone has signed up before is not a stranger's to find out. */
    if (data?.ok) return { ok: true }
    return { ok: false, error: 'That does not look like an email address.' }
  } catch {
    return { ok: false, error: 'Could not reach us. Check your connection and try again.' }
  } finally {
    clearTimeout(timer)
  }
}
