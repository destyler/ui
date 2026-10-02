import { mount, tick, unmount } from 'svelte'
import { afterEach, expect, it, vi } from 'vitest'
import NullableControlled from './NullableControlled.svelte'

const disposers: (() => Promise<void>)[] = []
afterEach(async () => {
  for (const dispose of disposers.splice(0)) await dispose()
  document.body.replaceChildren()
})
async function settle() {
  await tick()
  await new Promise(resolve => setTimeout(resolve, 0))
  await tick()
}
it.each([null, 'alpha'])('keeps nullable bind:value ownership (initial=%s)', async (initial) => {
  const changes = vi.fn()
  const container = document.createElement('div')
  document.body.append(container)
  const app = mount(NullableControlled, { target: container, props: { initial, onChange: changes } })
  disposers.push(() => unmount(app))
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
