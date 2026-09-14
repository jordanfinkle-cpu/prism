/* The Prism design system, as consumed by the site.

   prism-ds.js is the design project's compiled bundle, taken byte-for-byte from
   claude.ai/design project 87613f02-6b30-411b-a06b-ae6d60204214 (`_ds_bundle.js`). Its
   components register themselves onto window.PrismDesignSystem_87613f. Re-sync by
   re-downloading that file — do not hand-edit it here.

   ADAPTED FROM THE DESIGN: the vendored copy is the first 53 components (through
   components/notes/TaskRow.jsx) — everything the site renders. The design project's read API
   caps a file at 256 KiB and the bundle is larger, so the tail is not present: that tail is
   the unused Chrome, IOS, Deck and Pop preview scaffolding, plus the bundle's own closing
   `Object.assign(__ds_ns, __ds_scope)`, which is restated at the end of prism-ds.js. */
import './globals.js'
import './prism-ds.js'

const DS = window.PrismDesignSystem_87613f

if (import.meta.env.DEV && DS.__errors?.length) {
  console.error('[prism-ds] components failed to register:', DS.__errors)
}

export default DS
