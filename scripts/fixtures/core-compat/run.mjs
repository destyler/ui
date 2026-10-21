import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { Window } from 'happy-dom'

const window = new Window({ url: 'http://localhost' })
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLButtonElement', 'HTMLInputElement', 'Element', 'SVGElement', 'Node', 'Text', 'Comment', 'Document', 'DocumentFragment', 'NodeFilter', 'MutationObserver', 'ResizeObserver', 'Event', 'CustomEvent', 'MouseEvent'])
  Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? window : window[name] })
for (const name of ['requestAnimationFrame', 'cancelAnimationFrame', 'getComputedStyle'])
  globalThis[name] = window[name].bind(window)
const { mount } = await import('./client/index.js')
async function waitFor(check, message) {
  for (let i = 0; i < 100; i++) {
    if (check())
      return
    await delay(10)
  }
  assert.ok(check(), message)
}
try {
  for (const variant of ['omitted', 'default-false', 'default-true', 'controlled-false']) {
    const target = document.createElement('div')
    document.body.append(target)
    const changes = []
    const options = { id: `compat-${variant}`, onOpenChange: details => changes.push(details.open) }
    if (variant.startsWith('default'))
      options.defaultOpen = variant === 'default-true'
    if (variant === 'controlled-false')
      options.open = false
    const dispose = mount(target, options)
    try {
      await waitFor(() => target.querySelector('[data-part="trigger"]'), `${variant}: trigger must mount`)
      const trigger = target.querySelector('[data-part="trigger"]')
      const isOpen = () => trigger.getAttribute('aria-expanded') === 'true'
      await waitFor(() => isOpen() === (variant === 'default-true'), `${variant}: initial state`)
      if (variant === 'controlled-false') {
        trigger.click()
        await waitFor(() => changes.length > 0, 'Controlled click must request a state change')
        await delay(50)
        assert.equal(isOpen(), false, 'Controlled false must remain closed without parent update')
        assert.deepEqual(changes, [true])
      }
      else {
        if (variant === 'default-true') {
          target.querySelector('[data-part="close-trigger"]').click()
          await waitFor(() => !isOpen(), 'defaultOpen must seed, not control, state')
        }
        for (let i = 0; i < 2; i++) {
          trigger.click()
          await waitFor(isOpen, `${variant}: uncontrolled Dialog must open`)
          target.querySelector('[data-part="close-trigger"]').click()
          await waitFor(() => !isOpen(), `${variant}: Dialog must close`)
        }
        assert.deepEqual(changes, variant === 'default-true' ? [false, true, false, true, false] : [true, false, true, false])
      }
      console.log(`PASS Dialog ${variant}`)
    }
    finally {
      await dispose()
      target.remove()
    }
  }
}
finally { await window.happyDOM.close() }
