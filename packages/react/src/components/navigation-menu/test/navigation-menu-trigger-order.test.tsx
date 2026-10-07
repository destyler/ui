import type { Root } from 'react-dom/client'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Basic } from '../examples/Basic'

const fixtures: { root: Root, container: HTMLDivElement }[] = []
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
})
async function cleanupFixtures() {
  for (const { root, container } of fixtures.splice(0)) {
    await act(async () => root.unmount())
    container.remove()
  }
}

afterEach(async () => {
  await cleanupFixtures()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

// A native click moves the pointer before its click event. Either the zero-delay
// hover timer or the click can win; exercise both through the complete public fixture.
it.each([
  { disableHoverTrigger: false, flushHoverBeforeClick: true, expectedOpen: false },
  { disableHoverTrigger: false, flushHoverBeforeClick: false, expectedOpen: true },
  { disableHoverTrigger: true, flushHoverBeforeClick: true, expectedOpen: true },
  { disableHoverTrigger: true, flushHoverBeforeClick: false, expectedOpen: true },
])('keeps hover-disabled=$disableHoverTrigger timer-before-click=$flushHoverBeforeClick state consistent', async ({ disableHoverTrigger, flushHoverBeforeClick, expectedOpen }) => {
  const container = document.createElement('div')
  // Only the events dispatched below should drive these ordering checks.
  // Ignore the native pointer position left by other browser fixtures. Native
  // click/visibility coverage lives in navigation-menu.test.tsx, not this harness.
  container.style.pointerEvents = 'none'
  document.body.append(container)
  const root = createRoot(container)
  fixtures.push({ root, container })
  const onValueChange = vi.fn()
  await act(async () => root.render(<Basic disableHoverTrigger={disableHoverTrigger} openDelay={0} closeDelay={0} onValueChange={onValueChange} />))
  const trigger = container.querySelector<HTMLButtonElement>('[data-part="trigger"][data-value="components"]')!
  const content = container.querySelector<HTMLElement>('[data-part="content"][data-value="components"]')!
  const viewport = container.querySelector<HTMLElement>('[data-part="viewport"]')!
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  await act(async () => {
    trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
    if (flushHoverBeforeClick)
      await vi.advanceTimersByTimeAsync(0)
    trigger.click()
    await vi.advanceTimersByTimeAsync(0)
  })
  // Presence commits viewport exit on the next animation frame. Advance that
  // frame after React commits the click, without changing hover/click order.
  await act(async () => vi.advanceTimersToNextFrame())
  expect(trigger.getAttribute('aria-expanded')).toBe(String(expectedOpen))
  expect(content.dataset.state).toBe(expectedOpen ? 'open' : 'closed')
  expect(content.hidden).toBe(!expectedOpen)
  expect(viewport.hidden).toBe(!expectedOpen)
  for (const text of [
    'A modal dialog that interrupts the user with important content.',
    'For sighted users to preview content available behind a link.',
    'Displays an indicator showing the completion progress of a task.',
  ])
    expect(content.textContent).toContain(text)
  expect(onValueChange.mock.calls).toEqual(expectedOpen ? [[{ value: 'components' }]] : [[{ value: 'components' }], [{ value: null }]])
})

it('removes only its own fixture while another React root remains active', async () => {
  const otherContainer = document.createElement('div')
  document.body.append(otherContainer)
  const otherRoot = createRoot(otherContainer)
  const onClick = vi.fn()
  try {
    await act(async () => otherRoot.render(<button type="button" onClick={onClick}>Other owner</button>))
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    fixtures.push({ root, container })
    await act(async () => root.render(<Basic disableHoverTrigger />))

    await cleanupFixtures()

    expect(container.isConnected).toBe(false)
    expect(otherContainer.isConnected).toBe(true)
    await act(async () => otherContainer.querySelector<HTMLButtonElement>('button')!.click())
    expect(onClick).toHaveBeenCalledTimes(1)
    await act(async () => otherRoot.render(<button type="button">Still active</button>))
    expect(otherContainer.textContent).toBe('Still active')
  }
  finally {
    await act(async () => otherRoot.unmount())
    otherContainer.remove()
  }
})
