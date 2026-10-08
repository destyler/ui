import type { App } from 'vue'
import type { UseQrCodeContext } from '../composables/use-qr-code-context'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, onUnmounted, ref } from 'vue'
import { QrCode, useQrCode } from '../index'

// Register the same contract in the unit and Chromium projects.
export function testQrCodeEvents() {
  let app: App | undefined
  let mountedHost: HTMLElement | undefined

  function cleanup() {
    try {
      app?.unmount()
    }
    finally {
      app = undefined
      mountedHost?.remove()
      mountedHost = undefined
    }
  }

  afterEach(cleanup)

  function mount(controlled: boolean) {
    const value = ref('initial')
    const events: string[] = []
    const onValueChange = vi.fn(() => {
      events.push('valueChange')
    })
    const onUpdate = vi.fn((next: string) => {
      events.push('update:modelValue')
      value.value = next
    })
    const host = document.createElement('div')
    mountedHost = host
    document.body.appendChild(host)
    app = createApp({
      setup() {
        return () => h(QrCode.Root, {
          ...(controlled ? { modelValue: value.value } : { defaultValue: 'initial' }),
          'onValueChange': onValueChange,
          'onUpdate:modelValue': onUpdate,
        }, () => [
          h(QrCode.Context, null, {
            default: (api: UseQrCodeContext['value']) => [
              h('output', { 'data-testid': 'api-value' }, api.value),
              h('button', { onClick: () => api.setValue('edited') }, 'Edit'),
            ],
          }),
          h(QrCode.Frame, null, () => h(QrCode.Pattern)),
        ])
      },
    })
    app.mount(host)
    return { host, value, onValueChange, onUpdate, events }
  }

  describe('qr-code root events', () => {
    it.each([false, true])('emits both public events exactly once when the context API edits the value (controlled=%s)', async (controlled) => {
      const { host, value, onValueChange, onUpdate, events } = mount(controlled)
      await nextTick()
      expect(onValueChange).not.toHaveBeenCalled()
      expect(onUpdate).not.toHaveBeenCalled()
      const initialPath = host.querySelector('path')!.getAttribute('d')
      host.querySelector('button')!.click()
      await nextTick()
      expect(onValueChange.mock.calls).toEqual([[{ value: 'edited' }]])
      expect(onUpdate.mock.calls).toEqual([['edited']])
      expect(events).toEqual(['valueChange', 'update:modelValue'])
      expect(value.value).toBe('edited')
      await vi.waitFor(() => expect(host.querySelector('output')!.textContent).toBe('edited'))
      expect(host.querySelector('path')!.getAttribute('d')).not.toBe(initialPath)
      host.querySelector('button')!.click()
      await nextTick()
      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onUpdate).toHaveBeenCalledTimes(1)
    })

    it('preserves the existing composable emitter order as a control', async () => {
      const emit = vi.fn()
      const host = document.createElement('div')
      mountedHost = host
      document.body.appendChild(host)
      app = createApp({
        setup() {
          const api = useQrCode({ defaultValue: 'initial' }, emit)
          return () => h('button', { onClick: () => api.value.setValue('edited') }, 'Edit')
        },
      })
      app.mount(host)
      host.querySelector('button')!.click()
      expect(emit.mock.calls).toEqual([['valueChange', { value: 'edited' }], ['update:modelValue', 'edited']])
    })

    it('updates rendering from parent model changes without emitting an edit', async () => {
      const { host, value, onValueChange, onUpdate } = mount(true)
      await nextTick()
      value.value = 'external'
      await nextTick()
      await vi.waitFor(() => expect(host.querySelector('output')!.textContent).toBe('external'))
      expect(onValueChange).not.toHaveBeenCalled()
      expect(onUpdate).not.toHaveBeenCalled()
    })
  })

  it('keeps unrelated owners alive and disposes only its own host across repeated mounts', async () => {
    vi.useFakeTimers()
    const sentinel = document.createElement('aside')
    document.body.appendChild(sentinel)
    const clicks = ref(0)
    const onDispose = vi.fn()
    const owner = createApp({
      setup() {
        onUnmounted(onDispose)
        return () => h('button', { onClick: () => clicks.value++ }, String(clicks.value))
      },
    })
    try {
      owner.mount(sentinel)
      for (let iteration = 0; iteration < 3; iteration++) {
        const { host, value, onValueChange, onUpdate, events } = mount(true)
        await nextTick()
        host.querySelector('button')!.click()
        await nextTick()
        expect(events).toEqual(['valueChange', 'update:modelValue'])
        expect(onValueChange.mock.calls).toEqual([[{ value: 'edited' }]])
        expect(onUpdate.mock.calls).toEqual([['edited']])
        expect(value.value).toBe('edited')
        cleanup()
        await nextTick()
        expect(host.isConnected).toBe(false)
        expect(host.childElementCount).toBe(0)
        expect(vi.getTimerCount()).toBe(0)
        value.value = 'after-disposal'
        await nextTick()
        expect(events).toEqual(['valueChange', 'update:modelValue'])
        expect(sentinel.isConnected).toBe(true)
        expect(onDispose).not.toHaveBeenCalled()
        sentinel.querySelector('button')!.click()
        await nextTick()
        expect(sentinel.textContent).toBe(String(iteration + 1))
      }
    }
    finally {
      cleanup()
      owner.unmount()
      sentinel.remove()
      vi.useRealTimers()
    }
    expect(onDispose).toHaveBeenCalledTimes(1)
  })
}
