import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import BindingFixture from './binding.fixture.svelte'
import { createCarouselBindingTrace } from './carousel-binding-trace'

it.each(['bound', 'bound-undefined'] as const)('carousel %s reports repeated requests without stale scroll writeback', async (mode) => {
  const trace = createCarouselBindingTrace(mode)
  const onChange = vi.fn(trace.onChange)
  const onWrite = vi.fn(trace.onWrite)
  const screen = await render(BindingFixture, { props: { name: 'Carousel.page', mode, onChange, onWrite } })
  trace.attach(screen.container)
  try {
    // Match the existing contract's rapid repeated requests first, without
    // adding waits that could hide a race in a delayed scroll callback.
    for (let cycle = 0; cycle < 10; cycle++) {
      for (const [button, value] of [['request-next', 1], ['request-initial', 0]] as const) {
        trace.record(button, { cycle })
        await screen.getByTestId(button).click()
        await expect.element(screen.getByTestId('api-state')).toHaveTextContent(String(value))
        await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(String(value))
        expect(onChange.mock.lastCall?.[0]).toBe(value)
        expect(onWrite.mock.lastCall?.[0]).toBe(value)
      }
    }
    trace.record('complete')
  }
  catch (error) {
    trace.report()
    throw error
  }
  finally {
    trace.restore()
  }
})
