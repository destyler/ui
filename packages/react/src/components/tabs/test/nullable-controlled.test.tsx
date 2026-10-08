import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Tabs } from '../index'

const disposers: (() => void)[] = []
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  await act(async () => disposers.splice(0).forEach(dispose => dispose()))
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

it.each([null, 'alpha'])('keeps parent-owned nullable Tabs state (initial=%s)', async (initial) => {
  const changes = vi.fn()
  function Fixture() {
    const [value, setValue] = useState<string | null>(initial)
    return (
      <>
        <button onClick={() => setValue(null)}>Parent clear</button>
        <button onClick={() => setValue('alpha')}>Parent restore</button>
        <output>{value ?? 'none'}</output>
        <Tabs.Root
          value={value}
          onValueChange={(details) => {
            changes(details.value)
            setValue(details.value)
          }}
        >
          <Tabs.List><Tabs.Trigger value="alpha">Alpha</Tabs.Trigger><Tabs.Trigger value="beta">Beta</Tabs.Trigger></Tabs.List>
          <Tabs.Content value="alpha">Alpha content</Tabs.Content><Tabs.Content value="beta">Beta content</Tabs.Content>
        </Tabs.Root>
      </>
    )
  }
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  disposers.push(() => root.unmount())
  await act(async () => root.render(<Fixture />))
  const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  const output = container.querySelector('output')!
  const clear = container.querySelectorAll('button')[0]
  const restore = container.querySelectorAll('button')[1]
  expect(tabs[0].getAttribute('aria-selected')).toBe(String(initial === 'alpha'))
  expect(output.textContent).toBe(initial ?? 'none')
  expect(changes).not.toHaveBeenCalled()
  for (let cycle = 0; cycle < 2; cycle++) {
    await act(async () => clear.click())
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(output.textContent).toBe('none')
    expect(Array.from(tabs).every(tab => tab.getAttribute('aria-selected') === 'false')).toBe(true)
    expect(Array.from(container.querySelectorAll<HTMLElement>('[role="tabpanel"]')).every(panel => panel.hidden)).toBe(true)
    expect(changes).toHaveBeenCalledTimes(cycle)
    await act(async () => tabs[1].click())
    expect(output.textContent).toBe('beta')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(changes).toHaveBeenNthCalledWith(cycle + 1, 'beta')
    await act(async () => restore.click())
    expect(output.textContent).toBe('alpha')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(changes).toHaveBeenCalledTimes(cycle + 1)
  }
})
