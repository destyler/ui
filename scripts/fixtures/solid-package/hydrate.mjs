import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { exercise, window } from './dom.mjs'

const errors = []
const originalError = console.error
const originalWarn = console.warn
console.error = console.warn = (...args) => errors.push(args.map(String).join(' '))
const { entries, mount } = await import('./client/index.js')
assert.ok(Object.keys(entries).length > 1)
const container = document.createElement('div')
container.innerHTML = await readFile('ssr.html', 'utf8')
document.body.append(container)
// Solid 1.8 requires its server-generated hydration bootstrap to execute.
// HappyDOM does not execute scripts assigned through innerHTML automatically.
for (const script of container.querySelectorAll('script'))
  window.eval(script.textContent)
globalThis._$HY = window._$HY
const original = container.querySelector('#packed-toggle')
const changes = { pressed: [], open: [] }
let dispose
try {
  dispose = mount(container, changes)
  await exercise(container, original, changes)
  assert.deepEqual(errors, [], 'Hydration and interaction must not warn or error')
}
finally {
  await dispose?.()
  console.error = originalError
  console.warn = originalWarn
  await window.happyDOM.close()
}
