// @ts-check
import { defineConfig, envField } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://www.downloadprism.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react(), sitemap({ filter: (p) => !p.includes('/404') })],
  env: {
    schema: {
      // The publishable key is designed to ship in a client and grants nothing on its own:
      // prism_waitlist has RLS with zero policies, reachable only through prism_request_access,
      // a SECURITY DEFINER function that can insert and cannot read. Defaults live here so CI
      // needs no secrets; a .env overrides them if the key is ever rotated.
      PUBLIC_SUPABASE_URL: envField.string({
        context: 'client', access: 'public',
        default: 'https://xpfkhiycdlvwgpbghxak.supabase.co',
      }),
      PUBLIC_SUPABASE_PUBLISHABLE_KEY: envField.string({
        context: 'client', access: 'public',
        default: 'sb_publishable_Cb2VV5Vzq76BkhdP8njpQw_cpH1vhem',
      }),
    },
  },
})
