import assert from 'node:assert/strict'
import { exercise, window } from './dom.mjs'

const errors = []
const originalError = console.error
const originalWarn = console.warn
console.error = console.warn = (...args) => errors.push(args.map(String).join(' '))
const { entries, mount } = await import('./import-client/index.js')
assert.equal(Object.keys(entries).length, 57)
for (const entry of Object.values(entries))
  assert.ok(Object.keys(entry).length > 0, 'Every default entry must import')
const container = document.createElement('div')
document.body.append(container)
const changes = { pressed: [], open: [] }
let dispose
try {
  dispose = mount(container, changes)
  await exercise(container, container.querySelector('#packed-toggle'), changes)
  assert.deepEqual(errors, [], 'Default imports must render and interact without warnings or errors')
}
finally {
  await dispose?.()
  console.error = originalError
  console.warn = originalWarn
  await window.happyDOM.close()
}
