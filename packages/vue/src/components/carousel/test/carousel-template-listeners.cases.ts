import * as core from '@destyler/carousel'
import { normalizeProps } from '@destyler/vue'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, h } from 'vue'
import { Carousel } from '../index'
import Fixture from './CarouselListenerTemplate.fixture.vue'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))
it.each(['array', 'null'])('supports normal SFC %s listeners without losing Next', async (mode) => {
  const send = vi.fn()
  const api = core.connect(core.machine({ id: 'template', page: 1, slideCount: 4 }).getState(), send, normalizeProps)
  const first = vi.fn()
  const second = vi.fn()
  const container = document.createElement('div')
  document.body.appendChild(container)
  const app = createApp({ render: () => h(Carousel.RootProvider, { value: api }, () => h(Fixture, { mode, first, second })) })
  app.mount(container)
  cleanups.push(() => {
    app.unmount()
    container.remove()
  })
  container.querySelector<HTMLElement>('[data-testid="control"]')!.click()
  if (mode === 'array') {
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
  }
  expect(send).toHaveBeenCalledExactlyOnceWith({ type: 'PAGE.NEXT', src: 'trigger' })
})
