import { expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref, watch } from 'vue'
import { Toggle } from '../index'

it('renders the newest parent normalization and preserves child writeback after a passive start', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const value = ref<boolean>()
  const normalize = ref(true)
  const generation = ref(0)
  const events = vi.fn()
  const pressed = vi.fn()
  const app = createApp({
    setup() {
      watch(value, (next) => {
        if (normalize.value && next === true)
          value.value = false
      }, { flush: 'post' })
      return () => h(Toggle.Root, {
        'key': generation.value,
        'modelValue': value.value,
        'defaultPressed': false,
        'onPressedChange': pressed,
        'onUpdate:modelValue': (next: boolean) => {
          events(next)
          value.value = next
        },
      }, () => 'Toggle')
    },
  })
  try {
    app.mount(container)
    await nextTick()
    const button = container.querySelector('button')!
    expect(button.getAttribute('aria-pressed')).toBe('false')

    // Initial undefined opts into passive state. A parent write can still be
    // normalized in the post-flush phase before the UI settles.
    value.value = true
    await nextTick()
    await nextTick()
    expect(value.value).toBe(false)
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(button.getAttribute('data-state')).toBe('off')
    expect(events).not.toHaveBeenCalled()
    expect(pressed).not.toHaveBeenCalled()

    normalize.value = false
    button.click()
    await nextTick()
    await nextTick()
    expect(value.value).toBe(true)
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(events.mock.calls).toEqual([[true]])
    expect(pressed.mock.calls).toEqual([[true]])

    // Recreate a passive child, ensuring the disposed proxy cannot echo into
    // the new instance and each subsequent click has exactly one writeback.
    value.value = undefined
    generation.value++
    await nextTick()
    const replacement = container.querySelector('button')!
    expect(replacement).not.toBe(button)
    expect(replacement.getAttribute('aria-pressed')).toBe('false')
    replacement.click()
    await nextTick()
    await nextTick()
    expect(value.value).toBe(true)
    expect(events.mock.calls).toEqual([[true], [true]])
    expect(pressed.mock.calls).toEqual([[true], [true]])
  }
  finally {
    app.unmount()
    container.remove()
  }
})
