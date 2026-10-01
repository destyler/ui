import type { App } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import Controlled from '../examples/Controlled.vue'

let app: App | undefined

afterEach(() => {
  app?.unmount()
  document.body.replaceChildren()
})

async function settleFrames() {
  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
}

function mount() {
  const host = document.createElement('div')
  document.body.append(host)
  app = createApp(Controlled)
  app.mount(host)
  return {
    trigger: host.querySelector<HTMLButtonElement>('button')!,
    state: () => host.querySelector('[data-part="trigger"]')?.getAttribute('data-state'),
  }
}

describe('controlled Menu external toggle', () => {
  it('does not dismiss between the external pointerdown/focus and click', async () => {
    const { trigger, state } = mount()
    for (let cycle = 0; cycle < 2; cycle++) {
      trigger.click()
      await vi.waitFor(() => expect(state()).toBe('open'))
      // Allow the deferred outside-interaction listener to attach. A fast
      // synthetic click alone misses the browser pointerdown-before-click race.
      await settleFrames()
      trigger.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true,
        composed: true,
        pointerType: 'mouse',
        button: 0,
      }))
      trigger.focus()
      await settleFrames()
      expect(state()).toBe('open')
      trigger.click()
      await vi.waitFor(() => expect(state()).toBe('closed'))
      await settleFrames()
      expect(state()).toBe('closed')
    }
  })

  it('still dismisses when the pointer is outside both menu and external toggle', async () => {
    const { trigger, state } = mount()
    trigger.click()
    await vi.waitFor(() => expect(state()).toBe('open'))
    await settleFrames()
    document.body.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      composed: true,
      pointerType: 'mouse',
      button: 0,
    }))
    await vi.waitFor(() => expect(state()).toBe('closed'))
    await settleFrames()
    expect(state()).toBe('closed')
  })
})
