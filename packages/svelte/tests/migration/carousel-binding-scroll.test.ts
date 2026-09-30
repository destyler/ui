import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import BindingFixture from './binding.fixture.svelte'

it.each(['bound', 'bound-undefined'] as const)('carousel %s reports repeated requests without stale scroll writeback', async (mode) => {
  const events: unknown[] = []
  let read: (() => object) | undefined
  const onChange = vi.fn((value: unknown) => events.push({ type: 'change', value, ...read?.() }))
  const onWrite = vi.fn((value: unknown) => events.push({ type: 'write', value, ...read?.() }))
  const screen = await render(BindingFixture, { props: { name: 'Carousel.page', mode, onChange, onWrite } })
  const group = screen.container.querySelector<HTMLElement>('[data-part="item-group"]')!
  const snapshot = () => ({
    api: screen.getByTestId('api-state').element().textContent,
    snapPoints: screen.getByTestId('page-snap-points').element().textContent,
    parent: screen.getByTestId('parent-state').element().textContent,
    scrollLeft: group.scrollLeft,
    width: group.clientWidth,
    scrollWidth: group.scrollWidth,
    items: Array.from(group.children).map(item => ({
      index: (item as HTMLElement).dataset.index,
      inView: (item as HTMLElement).dataset.inview,
      left: item.getBoundingClientRect().left - group.getBoundingClientRect().left,
      width: item.getBoundingClientRect().width,
    })),
  })
  read = snapshot
  const onScroll = () => events.push({ type: 'scroll', ...snapshot() })
  const scrollTo = group.scrollTo.bind(group)
  const scrollSpy = vi.spyOn(group, 'scrollTo').mockImplementation((...args: Parameters<HTMLElement['scrollTo']>) => {
    events.push({ type: 'scrollTo', args, ...snapshot() })
    scrollTo(...args)
  })
  group.addEventListener('scroll', onScroll)
  try {
    // Match the existing contract's rapid repeated requests first, without
    // adding waits that could hide a race in a delayed scroll callback.
    for (let cycle = 0; cycle < 10; cycle++) {
      for (const [button, value] of [['request-next', 1], ['request-initial', 0]] as const) {
        events.push({ type: button, cycle, ...snapshot() })
        await screen.getByTestId(button).click()
        await expect.element(screen.getByTestId('api-state')).toHaveTextContent(String(value))
        await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(String(value))
        expect(onChange.mock.lastCall?.[0]).toBe(value)
        expect(onWrite.mock.lastCall?.[0]).toBe(value)
      }
    }
    events.push({ type: 'complete', ...snapshot() })
  }
  catch (error) {
    console.error('Carousel synchronization trace', JSON.stringify({ mode, events, final: snapshot() }))
    throw error
  }
  finally {
    group.removeEventListener('scroll', onScroll)
    scrollSpy.mockRestore()
  }
})
