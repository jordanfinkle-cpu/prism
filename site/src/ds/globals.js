/* The design-system bundle is the Claude Design project's own build output, vendored verbatim
   (prism-ds.js). It is written for the design project's preview pages, which load React and
   lucide as <script> globals — so it reads bare `React` and `window.lucide` rather than
   importing them. This module hands it those two globals, and must be evaluated BEFORE
   prism-ds.js: ES modules evaluate in import order, which is why ds/index.js lists it first.
   The bundle itself is unmodified. */
import React from 'react'
import {
  createElement,
  // Every glyph the site can ask for. The design project's preview pages load lucide's whole
  // UMD build; importing the map wholesale here ships 1756 icons to draw eighteen, so the set
  // is named explicitly and tree-shaken. Icon's own CUSTOM map serves "note", which is why
  // that one is absent. Sources: literal name= in prism-ds.js, plus the names the site passes
  // (Sections' step icons, Mockups' rail/tab-bar/status-bar icons).
  ArrowUp, BatteryFull, Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight, Folder,
  GitFork, List, MessageCircle, Mic, Plus, Search, SignalHigh, User, Wifi, X,
} from 'lucide'

const icons = {
  ArrowUp, BatteryFull, Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight, Folder,
  GitFork, List, MessageCircle, Mic, Plus, Search, SignalHigh, User, Wifi, X,
}

/* A name outside the set renders as empty space rather than erroring, so in dev say so out
   loud — that is the one way this subsetting can bite after a design re-sync. */
const seen = new Set()
const guarded = import.meta.env.DEV
  ? new Proxy(icons, {
      get(target, key) {
        if (typeof key === 'string' && !(key in target) && !seen.has(key)) {
          seen.add(key)
          console.warn('[prism-ds] icon "' + key + '" is not in the site subset — add it to src/ds/globals.js')
        }
        return target[key]
      },
    })
  : icons

window.React = React
window.lucide = { createElement, icons: guarded }
