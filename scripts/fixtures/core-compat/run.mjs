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
function isOpen(trigger) {
  return trigger.getAttribute('aria-expanded') === 'true' || trigger.getAttribute('data-state') === 'open'
}
try {
  for (const component of ['dialog', 'popover', 'menu']) {
    const label = component[0].toUpperCase() + component.slice(1)
    for (const variant of ['omitted', 'default-false', 'default-true', 'controlled-false']) {
      const target = document.createElement('div')
      document.body.append(target)
      const changes = []
      const options = { component, id: `compat-${component}-${variant}`, onOpenChange: details => changes.push(details.open) }
      if (variant.startsWith('default'))
        options.defaultOpen = variant === 'default-true'
      if (variant === 'controlled-false')
        options.open = false
      const dispose = mount(target, options)
      try {
        await waitFor(() => target.querySelector('[data-part="trigger"]'), `${label} ${variant}: trigger must mount`)
        const trigger = target.querySelector('[data-part="trigger"]')
        const opened = () => isOpen(trigger)
        const close = () => {
          if (component === 'menu')
            trigger.click()
          else
            target.querySelector('[data-part="close-trigger"]').click()
        }
        await waitFor(() => opened() === (variant === 'default-true'), `${label} ${variant}: initial state`)
        if (variant === 'controlled-false') {
          trigger.click()
          await waitFor(() => changes.length > 0, `${label}: controlled click must request a state change`)
          await delay(50)
          assert.equal(opened(), false, `${label}: controlled false must remain closed without parent update`)
          assert.deepEqual(changes, [true])
        }
        else {
          if (variant === 'default-true') {
            close()
            await waitFor(() => !opened(), `${label}: defaultOpen must seed, not control, state`)
          }
          for (let i = 0; i < 2; i++) {
            trigger.click()
            await waitFor(opened, `${variant}: uncontrolled ${label} must open`)
            close()
            await waitFor(() => !opened(), `${variant}: ${label} must close`)
          }
          assert.deepEqual(changes, variant === 'default-true' ? [false, true, false, true, false] : [true, false, true, false])
        }
        console.log(`PASS ${label} ${variant}`)
      }
      finally {
        await dispose()
        target.remove()
      }
    }
  }

  const target = document.createElement('div')
  document.body.append(target)
  const changes = []
  const dispose = mount(target, {
    component: 'tabs',
    id: 'compat-tabs',
    deselectable: true,
    onValueChange: details => changes.push(details.value),
  })
  try {
    await waitFor(() => target.querySelectorAll('[role="tab"]').length === 2, 'Tabs triggers must mount')
    const tabs = () => [...target.querySelectorAll('[role="tab"]')]
    const selected = () => tabs().find(tab => tab.getAttribute('aria-selected') === 'true')?.getAttribute('data-value') ?? null
    await waitFor(() => selected() === null, 'Uncontrolled Tabs must start with a null selection')
    tabs()[0].click()
    await waitFor(() => selected() === 'alpha', 'Tabs must select alpha')
    tabs()[0].click()
    await waitFor(() => selected() === null, 'Deselectable Tabs must clear the selection to null')
    tabs()[1].click()
    await waitFor(() => selected() === 'beta', 'Tabs must select beta after a null selection')
    assert.deepEqual(changes, ['alpha', null, 'beta'])
    console.log('PASS Tabs nullable')
  }
  finally {
    await dispose()
    target.remove()
  }
}
finally { await window.happyDOM.close() }
