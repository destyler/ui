import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { entries, render } from './server/index.js'

assert.ok(Object.keys(entries).length > 1)
for (const entry of Object.values(entries))
  assert.ok(Object.keys(entry).length > 0, 'Every public entry must import')
const html = render()
assert.match(html, /id="packed-toggle"/)
assert.match(html, /aria-pressed="false"/)
await writeFile('ssr.html', html)
