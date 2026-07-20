// Copies the built site (dist/) into the repo root that GitHub Pages serves,
// touching ONLY index.html + assets/ — CNAME, version*.json etc. stay put.
import { cpSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const dist = join(here, 'dist')

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html missing — run vite build first')
  process.exit(1)
}
rmSync(join(root, 'assets'), { recursive: true, force: true })
cpSync(join(dist, 'assets'), join(root, 'assets'), { recursive: true })
cpSync(join(dist, 'index.html'), join(root, 'index.html'))
if (existsSync(join(dist, 'avatars'))) {
  rmSync(join(root, 'avatars'), { recursive: true, force: true })
  cpSync(join(dist, 'avatars'), join(root, 'avatars'), { recursive: true })
}
console.log('deployed dist -> repo root (index.html, assets/, avatars/)')
