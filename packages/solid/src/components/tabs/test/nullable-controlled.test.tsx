import { createSignal } from 'solid-js'
import { isServer, render } from 'solid-js/web'
import { afterEach, expect, it, vi } from 'vitest'
import { Tabs } from '../index'

const disposers: (() => void)[] = []
afterEach(() => {
  disposers.splice(0).forEach(dispose => dispose())
  document.body.replaceChildren()
})
async function settle() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

it.each([null, 'alpha'])('keeps already-nullable parent Tabs state (initial=%s)', async (initial) => {
  expect(isServer).toBe(false)
  const changes = vi.fn()
  function Fixture() {
    const [value, setValue] = createSignal<string | null>(initial)
    return (
      <>
        <button onClick={() => setValue(null)}>Parent clear</button>
        <button onClick={() => setValue('alpha')}>Parent restore</button>
        <output>{value() ?? 'none'}</output>
        <Tabs.Root
          value={value()}
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
  disposers.push(render(() => <Fixture />, container))
  await settle()
  const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  const output = container.querySelector('output')!
  const [clear, restore] = container.querySelectorAll('button')
  expect(tabs[0].getAttribute('aria-selected')).toBe(String(initial === 'alpha'))
  expect(output.textContent).toBe(initial ?? 'none')
  expect(changes).not.toHaveBeenCalled()
  for (let cycle = 0; cycle < 2; cycle++) {
    clear.click()
    await settle()
    expect(output.textContent).toBe('none')
    expect(Array.from(tabs).every(tab => tab.getAttribute('aria-selected') === 'false')).toBe(true)
    expect(Array.from(container.querySelectorAll<HTMLElement>('[role="tabpanel"]')).every(panel => panel.hidden)).toBe(true)
    expect(changes).toHaveBeenCalledTimes(cycle)
    tabs[1].click()
    await settle()
    expect(output.textContent).toBe('beta')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(changes).toHaveBeenNthCalledWith(cycle + 1, 'beta')
    restore.click()
    await settle()
    expect(output.textContent).toBe('alpha')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(changes).toHaveBeenCalledTimes(cycle + 1)
  }
})
