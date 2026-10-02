import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { Window } from 'happy-dom'

export const window = new Window({ url: 'http://localhost' })
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLButtonElement', 'HTMLInputElement', 'Element', 'SVGElement', 'Node', 'Text', 'Comment', 'Document', 'DocumentFragment', 'NodeFilter', 'MutationObserver', 'ResizeObserver', 'Event', 'CustomEvent', 'MouseEvent'])
  Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? window : window[name] })
for (const name of ['requestAnimationFrame', 'cancelAnimationFrame', 'getComputedStyle'])
  globalThis[name] = window[name].bind(window)

export async function waitFor(check) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (check())
      return
    await delay(10)
  }
  assert.ok(check(), 'The packed consumer did not settle')
}

export async function exercise(container, original, changes) {
  await delay(50)
  const toggle = container.querySelector('#packed-toggle')
  assert.equal(toggle, original, 'Hydration must reuse server markup')
  assert.equal(toggle.getAttribute('aria-pressed'), 'false')
  toggle.click()
  await waitFor(() => toggle.getAttribute('aria-pressed') === 'true')
  toggle.click()
  await waitFor(() => toggle.getAttribute('aria-pressed') === 'false')
  assert.deepEqual(changes.pressed, [true, false])
  const trigger = container.querySelector('[data-scope="collapsible"][data-part="trigger"]')
  assert.ok(trigger)
  trigger.click()
  await waitFor(() => trigger.getAttribute('aria-expanded') === 'true')
  trigger.click()
  await waitFor(() => trigger.getAttribute('aria-expanded') === 'false')
  assert.deepEqual(changes.open, [true, false])
}
