import type { Component } from 'vue'
import { afterEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { ui } from '~/factory'
import { useCoreListenerProps } from '~/utils/core-listeners'
import ForwardedOnceButton from './fixtures/ForwardedOnceButton.vue'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

for (const adapted of [false, true]) {
  it.each(['click', 'keydown'] as const)(`adapted=${adapted}: trusted %s supports a dynamically added Once veto`, async (type) => {
    const key = type === 'click' ? 'onClick' : 'onKeydown'
    const order: string[] = []
    const once = vi.fn((event: Event) => {
      expect(event.isTrusted).toBe(true)
      order.push('once')
      event.preventDefault()
    })
    const listener = shallowRef<((event: Event) => void) | undefined>()
    const Part = defineComponent({
      inheritAttrs: false,
      setup() {
        const props = useCoreListenerProps(() => ({ [key]: (event: Event) => {
          expect(event.isTrusted).toBe(true)
          if (!event.defaultPrevented)
            order.push('core')
        } }))
        return () => h(ui.button as Component, { ...props(), asChild: adapted }, () => adapted
          ? h(ForwardedOnceButton, null, () => 'Control')
          : 'Control')
      },
    })
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(() => h(Part, { [`${key}Once`]: listener.value, 'data-testid': 'native-control' }))
    app.mount(host)
    cleanups.push(() => {
      app.unmount()
      host.remove()
    })
    const send = async () => {
      if (type === 'click') {
        await page.getByTestId('native-control').click()
      }
      else {
        host.querySelector('button')!.focus()
        await userEvent.keyboard('{ArrowDown}')
      }
    }
    await send()
    expect(order).toEqual(['core'])
    listener.value = once
    await nextTick()
    await send()
    expect(order).toEqual(['core', 'once'])
    await send()
    expect(order).toEqual(['core', 'once', 'core'])
    expect(once).toHaveBeenCalledTimes(1)
  })
}
