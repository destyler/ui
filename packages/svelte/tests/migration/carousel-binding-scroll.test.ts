import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import BindingFixture from './binding.fixture.svelte'

it.each(['bound', 'bound-undefined'] as const)('carousel %s keeps the latest request after delayed scroll writeback', async (mode) => {
  const onChange = vi.fn()
  const onWrite = vi.fn()
  const screen = await render(BindingFixture, { props: { name: 'Carousel.page', mode, onChange, onWrite } })
  await expect.element(screen.getByTestId('api-state')).toHaveTextContent('0')
  onChange.mockClear()
  onWrite.mockClear()
  const expected: number[] = []

  // Keep the rapid repeated requests that exposed the stale scroll callback.
  // No added wait may serialize the transitions inside this stress sequence.
  for (let cycle = 0; cycle < 10; cycle++) {
    for (const [button, value] of [['request-next', 1], ['request-initial', 0]] as const) {
      expected.push(value)
      await screen.getByTestId(button).click()
      await expect.element(screen.getByTestId('api-state')).toHaveTextContent(String(value))
      await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(String(value))
      expect(onChange.mock.lastCall?.[0]).toBe(value)
      expect(onWrite.mock.lastCall?.[0]).toBe(value)
    }
  }

  // Core's scroll completion delay is 150 ms. Assertions immediately after
  // the click can miss an obsolete callback overwriting the final request.
  // Observe beyond that window with real timers; do not poll until it recovers.
  await new Promise<void>(resolve => setTimeout(resolve, 250))
  expect(screen.getByTestId('api-state').element()).toHaveTextContent('0')
  expect(screen.getByTestId('parent-state').element()).toHaveTextContent('0')
  // Exact histories also reject a transient stale callback/writeback that
  // happens to return to zero before the final DOM assertion.
  expect(onChange.mock.calls.map(([value]) => value)).toEqual(expected)
  expect(onWrite.mock.calls.map(([value]) => value)).toEqual(expected)
})
