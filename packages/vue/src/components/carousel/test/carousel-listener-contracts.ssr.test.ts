import type { Component } from 'vue'
import { expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Carousel } from '../index'

const controls = [Carousel.NextTrigger, Carousel.PrevTrigger, Carousel.Indicator, Carousel.IndicatorGroup, Carousel.AutoplayTrigger, Carousel.ItemGroup]
for (const asChild of [false, true]) {
  it.each(controls)(`renders carousel wrapper in Node, asChild=${asChild}`, async (component) => {
    expect(typeof document).toBe('undefined')
    const consumer = vi.fn()
    const html = await renderToString(createSSRApp({ render: () => h(Carousel.Root, { slideCount: 3 }, () => h(component as Component, { 'index': 0, asChild, 'data-custom': 'SSR', 'title': 'retained', 'class': 'outer', 'onClick': consumer }, () => asChild ? h('article', { class: 'inner' }, 'Hello') : 'Hello')) }))
    expect(html).toContain('data-custom="SSR"')
    expect(html).toContain('title="retained"')
    expect(html).toContain('Hello')
    expect(html).toContain('outer')
    expect(consumer).not.toHaveBeenCalled()
    if (asChild) {
      expect(html).toContain('<article')
      expect(html).toContain('inner')
    }
  })
}
