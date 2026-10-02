import { afterEach, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import NullableControlled from './NullableControlled.vue'

const disposers: (() => void)[] = []
afterEach(() => {
  disposers.splice(0).forEach(dispose => dispose())
  document.body.replaceChildren()
})
async function settle() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
  await nextTick()
}
export function registerNullableTests() {
  it.each([null, 'alpha'])('keeps nullable v-model ownership (initial=%s)', async (initial) => {
    const changes = vi.fn()
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp(NullableControlled, { initial, onChange: changes })
    app.mount(container)
    disposers.push(() => app.unmount())
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
}
