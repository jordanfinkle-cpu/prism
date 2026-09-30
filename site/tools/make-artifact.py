#!/usr/bin/env python3
"""Flatten the built site into one self-contained HTML file.

Why this exists: the Astro build references its assets with root-relative paths
(/_astro/…), and the React islands import their own chunks by that same absolute
path at runtime. An Artifact is served from a path it chooses, and does not serve
root-relative URLs, so the module graph cannot survive the move. Rather than
fight it, this takes the server-rendered HTML — which already contains every
chapter, every mockup and every word — inlines the CSS and the font, drops the
island machinery, and re-attaches the behaviour that ports cleanly to plain JS.

What survives: layout, type, colour, every mockup, the scale-to-fit that keeps
them inside their column, the nav that takes its tone from the chapter under it,
scroll reveals, the FAQ, and the scroll-driven detection sequence.

What does not: the hero's nine-second loop and the note chapter's tab scrub,
because React only rendered one frame of each into the HTML. Both fall back to
the state they rest in, which is also what a visitor with reduced motion sees.

Usage: python3 tools/make-artifact.py <out.html>
"""

import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


def main(out_path: str) -> None:
    html = (DIST / "index.html").read_text()

    head = html[html.index("<head>") + 6 : html.index("</head>")]
    body = html[html.index(">", html.index("<body")) + 1 : html.rindex("</body>")]

    # The site's title carries its tagline, which is right for a search result
    # and wrong for a gallery tile. Here the page just needs its name.
    title = "Prism"
    del head

    # The font, inlined. A data URI sidesteps every question about what a
    # relative path resolves to once the page is served from somewhere else.
    woff2 = (ROOT / "public/fonts/inter-latin-opsz-normal.woff2").read_bytes()
    font_face = (
        "@font-face{font-family:'Inter Variable';font-style:normal;"
        "font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,"
        + base64.b64encode(woff2).decode()
        + ") format('woff2')}"
    )

    css = "".join(p.read_text() for p in sorted(DIST.glob("_astro/*.css")))

    # The wallpaper behind the meeting card. Inlined for the same reason the
    # font is: one file has to carry everything, and a path to /media would
    # resolve to nothing once this is served from somewhere else.
    wall = (ROOT / "public/media/desktop.jpg").read_bytes()
    wall_uri = "data:image/jpeg;base64," + base64.b64encode(wall).decode()

    # Strip the island machinery, keeping everything it wrapped.
    body = re.sub(r"</?astro-island[^>]*>", "", body)
    body = body.replace("<!--astro:end-->", "")
    body = re.sub(r"<script[\s\S]*?</script>", "", body)
    body = body.replace(
        "<style>astro-island,astro-slot,astro-static-slot{display:contents}</style>", ""
    )

    # Links have to work from wherever this page ends up being served. In-page
    # anchors lose their leading slash; the two real pages point at where they
    # live on the site itself, since only one page travels here.
    body = body.replace('href="/#', 'href="#').replace('href="/"', 'href="#"')
    for page in ("privacy", "terms"):
        body = body.replace(
            'href="/%s"' % page, 'href="https://www.downloadprism.com/%s"' % page
        )

    # The note chapter cannot scrub without React, so it stops being a pinned
    # chapter and becomes an ordinary one rather than 320vh of nothing moving.
    body = body.replace('class="ns" style="height:320vh;position:relative"', 'class="ns"')
    body = body.replace(
        'style="position:sticky;top:var(--nav-h);height:calc(100svh - var(--nav-h));'
        'display:flex;align-items:center;overflow:hidden"',
        'style="display:flex;align-items:center;padding-block:clamp(72px,9vw,120px)"',
        1,
    )

    body = body.replace("/media/desktop.jpg", wall_uri)

    # Escape every non-ASCII character in the markup. The page is UTF-8, but it
    # is about to be served by something whose charset declaration is not ours
    # to set, and an em dash that arrives as three bytes of noise is a visible
    # defect. None of the stylesheets contain non-ASCII, so this is text-only.
    body = "".join(c if ord(c) < 128 else "&#%d;" % ord(c) for c in body)
    title = "".join(c if ord(c) < 128 else "&#%d;" % ord(c) for c in title)

    page = (
        f"<title>{title}</title>\n<style>{font_face}\n{css}\n{EXTRA_CSS}</style>\n"
        f"{body}\n<script>\n{RUNTIME}\n</script>\n"
    )
    pathlib.Path(out_path).write_text(page)
    print(f"{out_path}  {len(page) / 1024:.0f} KB")


EXTRA_CSS = """
/* Reveals are inert until the script arms them, so nothing can be left
   stranded at zero opacity if the script never runs. */
[data-reveal]{transition:opacity .58s cubic-bezier(.32,.72,0,1),transform .58s cubic-bezier(.32,.72,0,1),filter .58s cubic-bezier(.32,.72,0,1)}
[data-reveal="in"]{opacity:1!important;transform:none!important;filter:none!important}
@media (prefers-reduced-motion:reduce){[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}}
.ra-note{margin:12px 0 0;font-size:13.5px;font-weight:500;color:var(--tone-ink3,var(--color-ink3))}
.ra-note a{color:inherit;text-underline-offset:3px}
"""


RUNTIME = r"""
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const clamp01 = (n) => Math.min(1, Math.max(0, n))

  /* --- Scale the mockups to their column ------------------------------------
     Each one is drawn at the size the real app draws it and then scaled down,
     so the geometry stays exact instead of reflowing into a layout the product
     does not have. */
  const fits = [...document.querySelectorAll('div[aria-hidden="true"] > div[style*="transform:scale("]')]
    .map((inner) => ({
      inner,
      box: inner.parentElement,
      w: parseFloat(inner.style.width),
      h: parseFloat(inner.style.height),
    }))
    .filter((f) => f.w > 0 && f.h > 0)

  function fit() {
    for (const f of fits) {
      const k = Math.min(1, f.box.clientWidth / f.w)
      f.inner.style.transform = 'scale(' + k + ')'
      f.box.style.height = f.h * k + 'px'
    }
  }

  /* --- Reveals --------------------------------------------------------------
     The server left these at zero opacity for the animation that never got to
     run. Hand them to an observer, and show them outright if it is missing. */
  const skip = (el) => el.closest('.ds-island') || el.classList.contains('ns-pane') || el.classList.contains('ds-cap')
  const hidden = [...document.querySelectorAll('[style*="opacity:0"]')].filter((el) => !skip(el))
  hidden.forEach((el) => el.setAttribute('data-reveal', ''))

  if (reduced || !('IntersectionObserver' in window)) {
    hidden.forEach((el) => el.setAttribute('data-reveal', 'in'))
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-reveal', 'in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    hidden.forEach((el) => io.observe(el))
    // Anything still hidden after a few seconds is a bug, not a pending
    // animation. Text the reader cannot see is worse than text that arrives
    // without ceremony.
    setTimeout(() => hidden.forEach((el) => el.setAttribute('data-reveal', 'in')), 4000)
  }

  /* --- Nav tone -------------------------------------------------------------
     The nav is whatever colour the chapter beneath it is: worked out from which
     chapter contains the line under the bar, so it cannot land on the wrong one
     when the reader flicks quickly or jumps to an anchor. */
  const nav = document.getElementById('nav')
  const chapters = [...document.querySelectorAll('[data-tone]')]
  let marks = []

  function measure() {
    marks = chapters.map((el) => {
      let top = 0
      for (let n = el; n; n = n.offsetParent) top += n.offsetTop
      return { top, bottom: top + el.offsetHeight, dark: el.dataset.tone === 'dark' }
    })
  }

  /* --- The detection sequence ----------------------------------------------
     All three states are in the page, stacked; scrolling past the chapter
     cross-fades them and morphs the box between the three sizes the app draws:
     236x150 card, 238x58 confirmation, 177x40 recording pill. */
  const dsWrap = document.querySelector('.ds')
  const dsBox = document.querySelector('.ds-island > div > div')
  const dsBodies = dsBox ? [...dsBox.children] : []
  const dsRing = document.querySelector('.ds-island svg circle[stroke-dasharray]')
  const RING_LEN = 58.12
  const dsCaps = [...document.querySelectorAll('.ds-cap')]
  const CAPS = [[0, 0.28], [0.42, 0.6], [0.78, 1]]

  const track = (p, stops, values) => {
    for (let i = 1; i < stops.length; i++) {
      if (p <= stops[i]) {
        const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1] || 1)
        return values[i - 1] + (values[i] - values[i - 1]) * clamp01(t)
      }
    }
    return values[values.length - 1]
  }
  const fade = (p, a, b, c, d) => (p < a ? 0 : p < b ? (p - a) / (b - a) : p < c ? 1 : p < d ? 1 - (p - c) / (d - c) : 0)

  function scrub() {
    if (!dsWrap || !dsBox || reduced) return
    const top = dsWrap.getBoundingClientRect().top
    const travel = dsWrap.offsetHeight - innerHeight
    const p = travel > 0 ? clamp01(-top / travel) : 0
    const S = [0, 0.32, 0.46, 0.62, 0.76]

    dsBox.style.width = track(p, S, [236, 236, 238, 238, 161]) + 'px'
    dsBox.style.height = track(p, S, [136, 136, 58, 58, 40]) + 'px'
    dsBox.style.borderRadius = track(p, S, [16, 16, 14, 14, 12]) + 'px'
    // The countdown lives on the dismiss control: the ring empties as the
    // card's own patience does.
    if (dsRing) dsRing.style.strokeDashoffset = clamp01((p - 0.04) / 0.26) * RING_LEN

    if (dsBodies[0]) dsBodies[0].style.opacity = String(1 - clamp01((p - 0.3) / 0.12))
    if (dsBodies[1]) dsBodies[1].style.opacity = String(fade(p, 0.36, 0.46, 0.6, 0.7))
    if (dsBodies[2]) dsBodies[2].style.opacity = String(clamp01((p - 0.66) / 0.12))

    const drift = clamp01((p - 0.86) / 0.14)
    dsBox.parentElement.style.transform = 'translate(' + drift * 96 + 'px,' + drift * -64 + 'px)'

    dsCaps.forEach((cap, i) => {
      const [a, b] = CAPS[i]
      cap.style.opacity = String(fade(p, Math.max(0, a - 0.06), a + 0.001, b, Math.min(1, b + 0.06)))
    })
  }

  function paint() {
    const line = scrollY + nav.offsetHeight
    let dark = false
    for (const m of marks) if (line >= m.top && line < m.bottom) dark = m.dark
    nav.dataset.navTone = dark ? 'dark' : 'light'
    nav.dataset.scrolled = String(scrollY > 8)
    scrub()
  }

  let queued = false
  const onScroll = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      paint()
    })
  }

  function relayout() {
    fit()
    measure()
    paint()
  }

  relayout()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', relayout)
  addEventListener('load', relayout)
  setTimeout(relayout, 600)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout)

  /* --- The form -------------------------------------------------------------
     This page is a copy of the site, not the site. The waitlist call would be
     blocked here, and a control that looks like it worked when it did nothing
     is worse than one that says where to go. */
  for (const form of document.querySelectorAll('form.ra')) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const help = form.querySelector('.ra-help')
      if (!help || help.dataset.swapped) return
      help.dataset.swapped = '1'
      help.className = 'ra-note'
      help.innerHTML =
        'This is a preview of the site. Request access on ' +
        '<a href="https://www.downloadprism.com">downloadprism.com</a>.'
    })
  }
})()
"""


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "artifact.html")
