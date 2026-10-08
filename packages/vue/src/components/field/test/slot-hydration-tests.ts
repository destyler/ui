import type { Component } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, reactive, shallowRef } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { ui } from '~/factory'
import { Field } from '../index'

type Tag = 'input' | 'textarea'
const disposers: (() => void)[] = []
afterEach(() => {
  disposers.splice(0).forEach(dispose => dispose())
  document.body.replaceChildren()
})

async function hydrate(render: () => ReturnType<typeof h>) {
  const container = document.createElement('div')
  document.body.append(container)
  container.innerHTML = await renderToString(createSSRApp({ render }))
  const serverRoot = container.firstElementChild
  const serverControl = container.querySelector<HTMLInputElement | HTMLTextAreaElement>('input,textarea')!
  const serverValue = serverControl.value
  const app = createSSRApp({ render })
  const warnings: string[] = []
  app.config.warnHandler = warning => warnings.push(warning)
  app.mount(container)
  disposers.push(() => app.unmount())
  await nextTick()
  expect(container.firstElementChild).toBe(serverRoot)
  expect(container.querySelector('input,textarea')).toBe(serverControl)
  expect(serverControl.value).toBe(serverValue)
  expect(warnings).toEqual([])
  return { container, control: serverControl, warnings, app }
}

export function registerSlotHydrationTests() {
  describe.each(['input', 'textarea'] as const)('Field %s absent default slot', (tag: Tag) => {
    it.each([
      { asChild: false, initial: 'seed' },
      { asChild: false, initial: '' },
      { asChild: true, initial: 'seed' },
      { asChild: true, initial: '' },
    ])('preserves hydration value/ref identity and live model updates (asChild=$asChild, initial=$initial)', async ({ asChild, initial }) => {
      const state = reactive({ value: initial })
      const exposed = shallowRef<any>()
      const changes = vi.fn()
      const nativeInput = vi.fn()
      const controlComponent = tag === 'input' ? Field.Input : Field.Textarea
      const Fixture = defineComponent({
        setup: () => () => h(Field.Root, { id: 'hydrated-control' }, () => h(controlComponent as Component, {
          'ref': exposed,
          'asChild': asChild,
          'modelValue': state.value,
          'aria-label': 'Name',
          'data-consumer': 'kept',
          'onInput': nativeInput,
          'onUpdate:modelValue': (value: string) => {
            changes(value)
            state.value = value
          },
        }, asChild ? () => h(tag, { 'data-child': 'kept' }) : undefined)),
      })
      const { container, control, warnings, app } = await hydrate(() => h(Fixture))
      expect(control.value).toBe(initial)
      expect(exposed.value.$el).toBe(control)
      expect(control.getAttribute('aria-label')).toBe('Name')
      expect(control.getAttribute('data-consumer')).toBe('kept')
      expect(control.hasAttribute('data-child')).toBe(asChild)
      expect(changes).not.toHaveBeenCalled()
      expect(nativeInput).not.toHaveBeenCalled()
      control.value = 'typed'
      control.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
      expect(state.value).toBe('typed')
      expect(changes).toHaveBeenCalledExactlyOnceWith('typed')
      expect(nativeInput).toHaveBeenCalledTimes(1)
      expect(nativeInput.mock.calls[0][0].target).toBe(control)
      state.value = 'parent-update'
      await nextTick()
      expect(control.value).toBe('parent-update')
      expect(container.querySelector(tag)).toBe(control)
      expect(exposed.value.$el).toBe(control)
      expect(changes).toHaveBeenCalledTimes(1)
      expect(nativeInput).toHaveBeenCalledTimes(1)
      expect(warnings).toEqual([])
      app.unmount()
      disposers.pop()
      expect(exposed.value).toBeNull()
    })

    it.each(['native', 'factory'] as const)('retains the working %s no-slot baseline', async (kind) => {
      const { control } = await hydrate(() => kind === 'native'
        ? h(tag, { value: 'native-seed' })
        : h(ui[tag] as Component, { value: 'native-seed' }))
      expect(control.value).toBe('native-seed')
    })
  })
}
