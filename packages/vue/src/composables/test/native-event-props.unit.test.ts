import type { Component } from 'vue'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { ui } from '~/factory'
import { useNativeEventProps } from '~/index'
import { createOnceListenerProps, useCoreListenerProps } from '~/utils/core-listeners'
import ForwardedOnceButton from './fixtures/ForwardedOnceButton.vue'

const cleanups: Array<() => void> = []
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})
async function boundary() {
  await nextTick()
  const time = Date.now()
  await vi.waitFor(() => expect(Date.now()).toBeGreaterThan(time), { interval: 1 })
}

it('does not mistake undefined/sparse ordinary callbacks for an internal handler', () => {
  const compose = createOnceListenerProps()
  const consumer = vi.fn()
  const once = vi.fn()
  const result = compose({ onClick: [consumer, undefined], onClickOnce: once }, {})
  expect(result.onClick).toEqual([consumer, undefined])
  expect(result).toHaveProperty('onClickOnce')
})

it.each(['before', 'after'] as const)('retains Once consumption when core appears %s its first event', async (when) => {
  const core = vi.fn()
  const once = vi.fn()
  const enabled = shallowRef(false)
  const Part = defineComponent({
    inheritAttrs: false,
    setup() {
      const props = useCoreListenerProps(() => enabled.value ? { onClick: core } : {})
      return () => h(ui.button as Component, props())
    },
  })
  const host = document.createElement('div')
  const app = createApp(() => h(Part, { onClickOnce: once }))
  app.mount(host)
  cleanups.push(() => app.unmount())
  const button = host.querySelector('button')!
  await boundary()
  if (when === 'after')
    button.click()
  enabled.value = true
  await boundary()
  button.click()
  expect(once).toHaveBeenCalledTimes(1)
  expect(core).toHaveBeenCalledTimes(1)
  enabled.value = false
  await boundary()
  button.click()
  enabled.value = true
  await boundary()
  button.click()
  expect(once).toHaveBeenCalledTimes(1)
  expect(core).toHaveBeenCalledTimes(2)
})

it('tests the documented SFC example, forwarding attrs and exposed button ref', async () => {
  const core = vi.fn()
  const once = vi.fn((event: Event) => event.preventDefault())
  const exposed = shallowRef<{ $el: Element } | null>(null)
  const Part = defineComponent({
    inheritAttrs: false,
    setup() {
      const props = useCoreListenerProps(() => ({ onClick: (event: Event) => {
        if (!event.defaultPrevented)
          core()
      } }))
      return () => h(ui.button as Component, { ...props(), asChild: true }, () => h(ForwardedOnceButton, { ref: exposed }, () => 'Example'))
    },
  })
  const host = document.createElement('div')
  const app = createApp(() => h(Part, { 'onClickOnce': once, 'id': 'actual-button', 'aria-label': 'Example' }))
  app.mount(host)
  cleanups.push(() => app.unmount())
  await boundary()
  const button = host.querySelector('button')!
  expect(button.id).toBe('actual-button')
  expect(button.getAttribute('aria-label')).toBe('Example')
  expect(exposed.value?.$el).toBe(button)
  expect(host.querySelector('div')!.id).toBe('')
  button.click()
  expect(core).not.toHaveBeenCalled()
  button.click()
  expect(core).toHaveBeenCalledTimes(1)
  expect(once).toHaveBeenCalledTimes(1)
})

it('keeps hydration mismatch diagnostics and Once cancellation for the adapted example', async () => {
  const core = vi.fn()
  const once = vi.fn((event: Event) => event.preventDefault())
  const Part = defineComponent({
    props: { id: String },
    setup(props) {
      const attrs = useCoreListenerProps(() => ({ onClick: (event: Event) => {
        if (!event.defaultPrevented)
          core()
      } }))
      return () => h(ui.button as Component, { ...attrs(), asChild: true }, () => h(ForwardedOnceButton, { id: props.id, onClickOnce: once }))
    },
  })
  const host = document.createElement('div')
  host.innerHTML = await renderToString(createSSRApp(() => h(Part, { id: 'server' })))
  const warnings = vi.fn()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const app = createSSRApp(() => h(Part, { id: 'client' }))
  app.config.warnHandler = warnings
  app.mount(host)
  cleanups.push(() => app.unmount())
  expect(warnings.mock.calls.some(call => String(call[0]).includes('Hydration attribute mismatch'))).toBe(true)
  await boundary()
  host.querySelector('button')!.click()
  expect(once).toHaveBeenCalledTimes(1)
  expect(core).not.toHaveBeenCalled()
  host.querySelector('button')!.click()
  expect(core).toHaveBeenCalledTimes(1)
})

it('exports the native helper through the public package entry', () => {
  expect(typeof useNativeEventProps).toBe('function')
})
