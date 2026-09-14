/* The only network call the marketing site makes.

   The publishable key is designed to ship in a client and grants nothing on its own:
   prism_waitlist has RLS enabled with zero policies, so it is unreachable except through
   prism_request_access — a SECURITY DEFINER function that can insert and cannot read. Anyone
   holding this key can add an address to the list and cannot see a single one.
   See supabase/early_access_setup.sql in the prism-aai repo. */
const SUPABASE_URL = 'https://xpfkhiycdlvwgpbghxak.supabase.co'
const SUPABASE_KEY = 'sb_publishable_Cb2VV5Vzq76BkhdP8njpQw_cpH1vhem'

export async function requestAccess(email) {
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/prism_request_access', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_email: email, p_source: 'site' }),
    })
    if (!r.ok) return { ok: false, error: 'Something went wrong on our end. Try again in a moment.' }
    const data = await r.json()
    /* The function reports success for an address already on the list, deliberately — whether
       someone has signed up before is not a stranger's to find out. */
    return data?.ok ? { ok: true } : { ok: false, error: data?.error || 'Something went wrong.' }
  } catch {
    return { ok: false, error: 'Could not reach us — check your connection and try again.' }
  }
}
