import type { Component } from 'vue'
import * as core from '@destyler/carousel'
import { normalizeProps } from '@destyler/vue'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { Carousel } from '../index'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

const controls = [
  { name: 'next', component: Carousel.NextTrigger, prop: 'onClick', event: 'click', expected: 'PAGE.NEXT' },
  { name: 'previous', component: Carousel.PrevTrigger, prop: 'onClick', event: 'click', expected: 'PAGE.PREV' },
  { name: 'indicator', component: Carousel.Indicator, prop: 'onClick', event: 'click', expected: 'PAGE.SET', props: { index: 0 } },
  { name: 'indicator group', component: Carousel.IndicatorGroup, prop: 'onKeydown', event: 'keydown', expected: 'PAGE.NEXT' },
  { name: 'autoplay', component: Carousel.AutoplayTrigger, prop: 'onClick', event: 'click', expected: 'AUTOPLAY.START' },
  { name: 'item group', component: Carousel.ItemGroup, prop: 'onMousedown', event: 'mousedown', expected: 'DRAGGING.START' },
]

for (const childKind of ['none', 'native', 'component'] as const) {
  for (const cancellation of ['none', 'preventDefault', 'stopImmediatePropagation'] as const) {
    it.each(controls)(`${childKind}/${cancellation}: preserves $name native listener-array order`, async (control) => {
      const calls: string[] = []
      const send = vi.fn(() => calls.push('core'))
      const api = core.connect(core.machine({ id: 'arrays', slideCount: 4, page: 1, allowMouseDrag: true }).getState(), send, normalizeProps)
      const first = vi.fn((event: Event) => {
        calls.push('first')
        if (cancellation !== 'none')
          event[cancellation]()
      })
      const second = vi.fn(() => calls.push('second'))
      const childListener = vi.fn(() => calls.push('child'))
      const listeners = shallowRef<unknown>([first, second])
      const updated = shallowRef(false)
      const rootRef = shallowRef<{ $el: Element }>()
      const Child = defineComponent({
        inheritAttrs: false,
        setup(_, { attrs }) {
          return () => h(updated.value ? 'section' : 'article', attrs, 'Child')
        },
      })
      const container = document.createElement('div')
      document.body.appendChild(container)
      const app = createApp({
        render: () => h(Carousel.RootProvider, { value: api }, () => h(control.component as Component, {
          ...control.props,
          'asChild': childKind !== 'none',
          'ref': rootRef,
          'data-testid': 'control',
          'class': ['outer', { active: true }],
          'style': [{ color: 'red' }, { backgroundColor: 'blue' }],
          [control.prop]: listeners.value,
        }, () => childKind === 'none'
          ? 'Control'
          : h((childKind === 'native' ? 'article' : Child) as Component, {
              [control.prop]: childListener,
            }))),
      })
      app.mount(container)
      cleanups.push(() => {
        app.unmount()
        container.remove()
      })
      const target = () => container.querySelector<HTMLElement>('[data-testid="control"]')!
      const dispatch = () => target().dispatchEvent(control.event === 'keydown'
        ? new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
        : new MouseEvent(control.event, { button: 0, bubbles: true, cancelable: true }))
      expect(rootRef.value?.$el).toBe(target())
      expect(target().classList.contains('outer')).toBe(true)
      expect(target().classList.contains('active')).toBe(true)
      expect(target().style.color).toBe('red')
      expect(target().style.backgroundColor).toBe('blue')
      dispatch()
      const expected = childKind === 'none' ? ['first'] : ['child', 'first']
      if (cancellation !== 'stopImmediatePropagation')
        expected.push('second')
      if (cancellation === 'none')
        expected.push('core')
      expect(calls).toEqual(expected)
      expect(first).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(cancellation === 'stopImmediatePropagation' ? 0 : 1)
      expect(send).toHaveBeenCalledTimes(cancellation === 'none' ? 1 : 0)
      for (const replacement of [null, undefined, []]) {
        listeners.value = replacement
        updated.value = true
        await nextTick()
        calls.splice(0)
        dispatch()
        expect(calls).toEqual(childKind === 'none' ? ['core'] : ['child', 'core'])
        expect(rootRef.value?.$el).toBe(target())
      }
    })
  }
}

for (const componentChild of [false, true]) {
  it.each(controls)(`componentChild=${componentChild}: lets $name child stop its listener chain`, async (control) => {
    const send = vi.fn()
    const consumer = vi.fn()
    const childListener = vi.fn((event: Event) => event.stopImmediatePropagation())
    const api = core.connect(core.machine({ id: 'child-stop', slideCount: 4, page: 1, allowMouseDrag: true }).getState(), send, normalizeProps)
    const Child = defineComponent({
      inheritAttrs: false,
      setup(_, { attrs }) {
        return () => h('article', attrs, 'Child')
      },
    })
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      render: () => h(Carousel.RootProvider, { value: api }, () => h(control.component as Component, {
        ...control.props,
        'asChild': true,
        'data-testid': 'control',
        [control.prop]: [consumer],
      }, () => h((componentChild ? Child : 'article') as Component, { [control.prop]: childListener }))),
    })
    app.mount(container)
    cleanups.push(() => {
      app.unmount()
      container.remove()
    })
    container.querySelector<HTMLElement>('[data-testid="control"]')!.dispatchEvent(control.event === 'keydown'
      ? new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
      : new MouseEvent(control.event, { button: 0, bubbles: true, cancelable: true }))
    expect(childListener).toHaveBeenCalledTimes(1)
    expect(consumer).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })
}
