import { expect, vi } from 'vitest'

// Start after mounting the closed fixture, so pre-existing framework listeners
// are outside the observation window. Track explicit add/remove pairs, not a
// global listener count or callback side effects from a stopped machine.
export function trackDocumentListeners(document: Document, type: string) {
  const target: EventTarget = document
  const add = target.addEventListener
  const remove = target.removeEventListener
  const active: { target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, capture: boolean }[] = []
  const captureOf = (options?: boolean | EventListenerOptions) => typeof options === 'boolean' ? options : options?.capture ?? false
  const addSpy = vi.spyOn(target, 'addEventListener').mockImplementation((eventType, listener, options) => {
    add.call(target, eventType, listener, options)
    if (eventType !== type || !listener)
      return
    const capture = captureOf(options)
    if (!active.some(entry => entry.listener === listener && entry.capture === capture))
      active.push({ target, type, listener, capture })
  })
  const removeSpy = vi.spyOn(target, 'removeEventListener').mockImplementation((eventType, listener, options) => {
    remove.call(target, eventType, listener, options)
    const index = active.findIndex(entry => entry.type === eventType && entry.listener === listener && entry.capture === captureOf(options))
    if (index !== -1)
      active.splice(index, 1)
  })

  return {
    expectActive() {
      expect(active.length, `open dialog installs document ${type} listeners`).toBeGreaterThan(0)
    },
    expectEmpty() {
      // Do not serialize Document/window in failures: framework globals may
      // expose throwing getters (for example Svelte's development rune guards).
      const remaining = active.map(({ type, listener, capture }) => ({ type, listener, capture }))
      expect(remaining, `document ${type} listeners added in this lifecycle are removed with matching identity and capture`).toEqual([])
    },
    restore() {
      // A failed assertion must not leak this test's listeners into later tests.
      for (const entry of active)
        remove.call(target, entry.type, entry.listener, entry.capture)
      active.length = 0
      removeSpy.mockRestore()
      addSpy.mockRestore()
    },
  }
}
