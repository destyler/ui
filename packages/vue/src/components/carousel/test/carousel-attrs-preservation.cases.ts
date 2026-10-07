import type { Component } from 'vue'
import * as core from '@destyler/carousel'
import { normalizeProps } from '@destyler/vue'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, shallowRef } from 'vue'
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
for (const asChild of [false, true]) {
  it.each(controls)(`asChild=${asChild}: preserves $name attrs, refs, and listener replacement`, async (control) => {
    const service = core.machine({ id: 'preservation', slideCount: 4, page: 1, allowMouseDrag: true })
    const send = vi.fn()
    const api = core.connect(service.getState(), send, normalizeProps)
    const canceled = vi.fn((event: Event) => event.preventDefault())
    const accepted = vi.fn()
    const childHandler = vi.fn()
    const handler = shallowRef<(event: Event) => void>(canceled)
    const updated = shallowRef(false)
    const rootRef = shallowRef<any>()
    const childRef = shallowRef<any>()
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      render: () => h(Carousel.RootProvider, { value: api }, () => h(control.component as Component, {
        ...control.props,
        asChild,
        'ref': rootRef,
        'data-testid': 'control',
        'data-custom': updated.value ? undefined : 'initial',
        'title': updated.value ? 'updated' : 'initial',
        'class': 'outer',
        'style': { color: 'red' },
        [control.prop]: handler.value,
      }, () => asChild ? h(updated.value ? 'section' : 'article', { ref: childRef, class: 'inner', [control.prop]: childHandler }, 'Control') : 'Control')),
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
    expect(rootRef.value.$el).toBe(target())
    expect(target().classList.contains('outer')).toBe(true)
    expect(target().style.color).toBe('red')
    expect(target().getAttribute('data-custom')).toBe('initial')
    if (asChild) {
      expect(target().tagName).toBe('ARTICLE')
      expect(childRef.value).toBe(target())
      expect(target().classList.contains('inner')).toBe(true)
    }
    dispatch()
    expect(canceled).toHaveBeenCalledTimes(1)
    expect(send).not.toHaveBeenCalled()
    handler.value = accepted
    updated.value = true
    await nextTick()
    expect(rootRef.value.$el).toBe(target())
    expect(target().getAttribute('title')).toBe('updated')
    expect(target().hasAttribute('data-custom')).toBe(false)
    if (asChild) {
      expect(target().tagName).toBe('SECTION')
      expect(childRef.value).toBe(target())
    }
    dispatch()
    expect(canceled).toHaveBeenCalledTimes(1)
    expect(accepted).toHaveBeenCalledTimes(1)
    expect(send).toHaveBeenCalledTimes(1)
    expect(send.mock.lastCall?.[0]).toMatchObject({ type: control.expected })
    if (asChild)
      expect(childHandler).toHaveBeenCalledTimes(2)
  })
}
