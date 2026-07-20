import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // fs.strict off: the dev server may be launched via the 8.3 short path
  // (JORDAN~1) and Vite's allow-list compares against the long real path.
  server: { port: 5210, fs: { strict: false } },
  // GitHub Pages serves the repo root; assets must resolve relative to index.html.
  base: './',
  build: { outDir: 'dist', emptyOutDir: true },
})
