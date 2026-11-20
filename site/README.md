# downloadprism.com

The Prism marketing site. Astro with React islands; static output, deployed to
GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npm run preview    # serve the built output
```

## How it is put together

- **One long page** (`src/pages/index.astro`), a chapter at a time. Each chapter
  declares `tone` (`light` / `canvas` / `dark`); the nav reads those to decide
  what colour to be.
- **The app, rebuilt in CSS** (`src/mockups/`). No screenshots: the geometry is
  lifted from `prism-aai/ui-react` and rendered at real size, then scaled to the
  column by `Fit`. Fixtures — every invented name, date and figure — live in one
  file, `src/mockups/fixtures.js`.
- **Two scroll-driven chapters** (`NoteScrub`, `DetectScrub`) built on `Pinned`.
  They unpin on phones and under `prefers-reduced-motion`, rendering the end
  state or a stacked strip instead.
- **Tokens** are the app's Mosaic values, in `src/styles/global.css`. The card
  hairline is a box-shadow, never a border; the seven accents are only ever dots,
  tints, discs and graph nodes.

## The things most likely to need editing

| What | Where |
|---|---|
| Any headline or body copy | `src/sections/*` |
| FAQ (page and its JSON-LD both read this) | `src/lib/faq.js` |
| Title, description, structured data | `src/lib/seo.js` |
| Legal entity name, contact, effective date | `src/lib/legal.js` |
| Waitlist endpoint and key | `astro.config.mjs` (`env.schema`), client in `src/lib/access.js` |

## Adding pricing later

The page deliberately has no pricing. When it needs one, add a `Chapter` between
`Devices` and `Close` in `src/pages/index.astro` — the tone alternation works out
if it is `canvas`.

## Real screen recordings

`src/components/Recording.astro` checks at build time whether
`public/media/<name>.mp4` exists. If it does, it renders the video; if not, it
renders the HTML mockup passed as children. Two slots are wired:

- `hangup-to-note` — hero. A call ends, the note writes itself.
- `ask-your-notes` — the Ask chapter.
- `meeting-detected` — reserved for the detection chapter.

Drop an mp4 (plus an optional `<name>.jpg` poster) into `public/media/` and it
takes over. Nothing else changes.
