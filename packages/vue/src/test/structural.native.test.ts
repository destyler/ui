import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createApp, h, nextTick } from 'vue'
import { AspectRatio } from '../components/aspect-ratio'
import { Label } from '../components/label'

// Native-browser only: an emulator cannot establish physical geometry or label activation.
describe('structural native layout and activation', () => {
  it.each([2, 0.5])('keeps actual aspect ratio %s and native label activation', async (ratio) => {
    const host = document.createElement('main')
    host.style.width = '320px'
    document.body.append(host)
    const app = createApp({ render: () => h('div', [h(AspectRatio.Root, { ratio }, () => h(AspectRatio.Content, {}, () => 'Media')), h(Label.Root, { for: 'native-field' }, () => 'Name'), h('input', { id: 'native-field' })]) })
    app.mount(host)
    await nextTick()
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
      app.unmount()
      host.remove()
    }
  })
})
