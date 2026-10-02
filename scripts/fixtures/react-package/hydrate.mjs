import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { Window } from 'happy-dom'

// Install browser globals before importing React or the published library so
// their environment detection follows the client path, in a fresh process.
const window = new Window({ url: 'http://localhost' })
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLButtonElement', 'Element', 'Node', 'NodeFilter', 'MutationObserver', 'ResizeObserver', 'Event', 'CustomEvent', 'MouseEvent']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? window : window[name] })
}
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window)
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window)
globalThis.getComputedStyle = window.getComputedStyle.bind(window)

const { createElement } = await import('react')
const { hydrateRoot } = await import('react-dom/client')
const { Fixture } = await import('./fixture.mjs')
const errors = []
const originalError = console.error
console.error = (...args) => errors.push(args.map(String).join(' '))
const container = document.createElement('div')
container.innerHTML = await readFile('ssr.html', 'utf8')
document.body.append(container)
const originalButton = container.querySelector('#packed-toggle')
const pressedChanges = []
const openChanges = []
const root = hydrateRoot(container, createElement(Fixture, {
  onPressedChange: value => pressedChanges.push(value),
  onOpenChange: details => openChanges.push(details.open),
}), { onRecoverableError: error => errors.push(String(error)) })

async function waitFor(check) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (check())
      return
    await delay(10)
  }
  assert.ok(check(), 'The consumer UI did not settle')
}

try {
  await delay(50)
  assert.equal(container.querySelector('#packed-toggle'), originalButton, 'Hydration must reuse server markup')
  assert.equal(originalButton.getAttribute('aria-pressed'), 'false')
  originalButton.click()
  await waitFor(() => originalButton.getAttribute('aria-pressed') === 'true')
  originalButton.click()
  await waitFor(() => originalButton.getAttribute('aria-pressed') === 'false')
  assert.deepEqual(pressedChanges, [true, false])

  const trigger = container.querySelector('[data-scope="collapsible"][data-part="trigger"]')
  assert.ok(trigger)
  trigger.click()
  await waitFor(() => trigger.getAttribute('aria-expanded') === 'true')
  trigger.click()
  await waitFor(() => trigger.getAttribute('aria-expanded') === 'false')
  assert.deepEqual(openChanges, [true, false])
  assert.deepEqual(errors, [], 'Hydration and interaction must not report React errors')
}
finally {
  root.unmount()
  console.error = originalError
  await window.happyDOM.close()
}
