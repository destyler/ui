import { flushSync, mount, unmount } from 'svelte'
import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import Fixture from './structural.fixture.svelte'

// Native-browser only: an emulator cannot establish physical geometry or label activation.
describe('structural native layout and activation', () => {
  it.each([2, 0.5])('keeps actual aspect ratio %s and native label activation', async (ratio) => {
    const host = document.createElement('main')
    host.style.width = '320px'
    document.body.append(host)
    const component = mount(Fixture, { target: host, props: { ratio, vertical: false } })
    flushSync()
    try {
      const frame = host.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="root"]')!
      const content = host.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="content"]')!
      await expect.poll(() => frame.getBoundingClientRect().width).toBe(320)
      expect(frame.getBoundingClientRect().height).toBeCloseTo(320 / ratio, 1)
      expect(content.getBoundingClientRect().width).toBeCloseTo(320, 1)
      expect(content.getBoundingClientRect().height).toBeCloseTo(320 / ratio, 1)
      await userEvent.click(page.getByText('Name', { exact: true }))
      expect(document.activeElement).toBe(host.querySelector('input'))
    }
    finally {
      await unmount(component)
      host.remove()
    }
  })
})
