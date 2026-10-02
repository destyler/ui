import * as core from '@destyler/carousel'
import { normalizeProps } from '@destyler/vue'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, shallowRef } from 'vue'
import { Carousel } from '../index'
import Fixture from './CarouselSlotFallback.fixture.vue'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))
it('retains a real SFC fallback and replaces it with supplied slot content', async () => {
  const send = vi.fn()
  const api = core.connect(core.machine({ id: 'fallback', page: 1, slideCount: 4 }).getState(), send, normalizeProps)
  const supplied = shallowRef(false)
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp({ render: () => h(Carousel.RootProvider, { value: api }, () => h(Fixture, null, supplied.value ? { default: () => h('a', { 'data-testid': 'supplied-target' }, 'Supplied') } : undefined)) })
  app.mount(container)
  cleanups.push(() => {
    app.unmount()
    container.remove()
  })
  container.querySelector<HTMLElement>('[data-testid="fallback-target"]')!.click()
  expect(send).toHaveBeenCalledTimes(1)
  supplied.value = true
  await nextTick()
  expect(container.querySelector('[data-testid="fallback-target"]')).toBeNull()
  container.querySelector<HTMLElement>('[data-testid="supplied-target"]')!.click()
  expect(send).toHaveBeenCalledTimes(2)
  supplied.value = false
  await nextTick()
  container.querySelector<HTMLElement>('[data-testid="fallback-target"]')!.click()
  expect(send).toHaveBeenCalledTimes(3)
})
