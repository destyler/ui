import type { Component, VNode } from 'vue'
import * as core from '@destyler/carousel'
import { normalizeProps } from '@destyler/vue'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, defineComponent, Fragment, h, nextTick, shallowRef } from 'vue'
import { Carousel } from '../index'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))
function mount(render: () => VNode) {
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp({ render })
  app.mount(container)
  cleanups.push(() => {
    app.unmount()
    container.remove()
  })
  return container
}
function api(send: (...args: unknown[]) => void) {
  return core.connect(core.machine({ id: 'boundary', page: 1, slideCount: 4 }).getState(), send, normalizeProps)
}
for (const kind of ['native', 'emits']) {
  for (const cancel of [false, true]) {
    it(`${kind} child keeps handler precedence and prevention=${cancel}`, async () => {
      const calls: string[] = []
      const send = vi.fn(() => calls.push('core'))
      const childRef = shallowRef<HTMLElement | { marker: number }>()
      const wrapperRef = shallowRef<{ $el: HTMLElement }>()
      const toggle = shallowRef(false)
      const childFn = vi.fn((e: Event) => {
        calls.push('child')
        if (cancel)
          e.preventDefault()
      })
      const parentFn = vi.fn(() => calls.push('parent'))
      const Child = defineComponent({
        inheritAttrs: false,
        emits: ['click'],
        setup(_, { attrs, emit, expose, slots }) {
          expose({ marker: 7 })
          return () => h(toggle.value ? 'a' : 'button', { ...attrs, onClick: (e: Event) => emit('click', e) }, slots.default?.())
        },
      })
      const connected = api(send)
      const root = mount(() => h(Carousel.RootProvider, { value: connected }, () => h(Carousel.NextTrigger, {
        'ref': wrapperRef,
        'asChild': true,
        'onClick': [parentFn],
        'class': toggle.value ? 'new-parent' : 'parent',
        'style': { color: toggle.value ? 'blue' : 'red' },
        'title': toggle.value ? 'updated' : 'old',
        'data-mutable': toggle.value ? undefined : 'present',
      }, () => h((kind === 'emits' ? Child : 'button') as Component, { 'ref': childRef, 'onClick': childFn, 'class': 'child', 'data-testid': 'target' }, () => 'click'))))
      const target = () => root.querySelector<HTMLElement>('[data-testid="target"]')!
      target().click()
      expect(calls).toEqual(cancel ? ['child', 'parent'] : ['child', 'parent', 'core'])
      expect(wrapperRef.value?.$el).toBe(target())
      const before = childRef.value
      if (kind === 'emits')
        expect(before).toMatchObject({ marker: 7 })
      toggle.value = true
      await nextTick()
      expect(childRef.value).toBe(before)
      expect(wrapperRef.value?.$el).toBe(target())
      expect(target().classList.contains('new-parent')).toBe(true)
      expect(target().classList.contains('child')).toBe(true)
      expect(target().classList.contains('parent')).toBe(false)
      expect(target().style.color).toBe('blue')
      expect(target().getAttribute('title')).toBe('updated')
      expect(target().hasAttribute('data-mutable')).toBe(false)
    })
  }
}
// Empty/missing asChild slots retain the shared Dynamic limitation. These
// controls cover supported non-empty fragments without adding fallback policy.
for (const multiple of [false, true]) {
  it(`retains nested fragments and multiple children=${multiple}`, () => {
    const send = vi.fn()
    const connected = api(send)
    const root = mount(() => h(Carousel.RootProvider, { value: connected }, () => h(Carousel.NextTrigger, { asChild: true }, () => [
      h(Fragment, [h(Fragment, [h('button', { 'data-testid': 'first' }, 'First')])]),
      ...(multiple ? [h('span', { 'data-testid': 'second' }, 'Second')] : []),
    ])))
    root.querySelector<HTMLElement>('[data-testid="first"]')!.click()
    expect(send).toHaveBeenCalledExactlyOnceWith({ type: 'PAGE.NEXT', src: 'trigger' })
    if (multiple)
      expect(root.querySelector('[data-testid="second"]')?.textContent).toBe('Second')
  })
}
