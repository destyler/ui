import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { exercise, window } from './dom.mjs'

const { createSSRApp } = await import('vue')
const { fixture } = await import('./fixture.mjs')
const container = document.createElement('div')
container.innerHTML = await readFile('ssr.html', 'utf8')
document.body.append(container)
const original = container.querySelector('#packed-toggle')
const changes = { pressed: [], open: [] }
const errors = []
const originalError = console.error
console.error = (...args) => errors.push(args.map(String).join(' '))
const app = createSSRApp({ render: () => fixture(changes) })
app.config.warnHandler = warning => errors.push(warning)
try {
  app.mount(container)
  await exercise(container, original, changes)
  assert.deepEqual(errors, [], 'Hydration and interaction must not warn or error')
}
finally {
  app.unmount()
  console.error = originalError
  await window.happyDOM.close()
}
