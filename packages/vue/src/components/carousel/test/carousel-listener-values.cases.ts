import type { Component } from 'vue'
import * as core from '@destyler/carousel'
import { normalizeProps } from '@destyler/vue'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, h } from 'vue'
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

for (const listenerKind of ['array', 'null']) {
  it.each(controls)(`${listenerKind}: preserves the $name unsuppressed core action`, async (control) => {
    const service = core.machine({ id: 'regression', slideCount: 4, page: 1, allowMouseDrag: true })
    const send = vi.fn()
    const api = core.connect(service.getState(), send, normalizeProps)
    const consumerA = vi.fn()
    const consumerB = vi.fn()
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      render: () => h(Carousel.RootProvider, { value: api }, () => h(control.component as Component, {
        ...control.props,
        'data-testid': 'control',
        [control.prop]: listenerKind === 'array' ? [consumerA, consumerB] : null,
      }, () => 'Control')),
    })
    app.mount(container)
    cleanups.push(() => {
      app.unmount()
      container.remove()
    })
    const target = container.querySelector<HTMLElement>('[data-testid="control"]')!
    const event = control.event === 'keydown'
      ? new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
      : new MouseEvent(control.event, { button: 0, bubbles: true, cancelable: true })
    target.dispatchEvent(event)
    if (listenerKind === 'array') {
      expect(consumerA).toHaveBeenCalledTimes(1)
      expect(consumerB).toHaveBeenCalledTimes(1)
    }
    expect(send).toHaveBeenCalledTimes(1)
    expect(send.mock.lastCall?.[0]).toMatchObject({ type: control.expected })
  })
}
