import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { nextTick } from 'vue'
import Basic from '../examples/Basic.vue'
import Script from '../examples/Script.vue'
import SrcDoc from '../examples/SrcDoc.vue'

describe('[frame] provider', () => {
  it('should render content inside the iframe', async () => {
    render(Basic)

    await nextTick()

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()
  })

  it('should apply custom styles from head slot', async () => {
    render(Basic)

    await nextTick()

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      const doc = iframeElement.contentDocument
      expect(doc).not.toBeNull()
      const styleElements = doc?.querySelectorAll('style')
      expect(styleElements?.length).toBeGreaterThan(0)
    })
  })

  it('should render content with custom srcDoc', async () => {
    render(SrcDoc)

    await nextTick()

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      const doc = iframeElement.contentDocument
      expect(doc).not.toBeNull()
      // Check that the custom srcDoc with font links is applied
      const links = doc?.querySelectorAll('link')
      expect(links?.length).toBeGreaterThan(0)
    })
  })

  it('should emit mount event when frame is ready', async () => {
    render(Script)

    await nextTick()

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    // The Script example uses @mount event to inject script
    await vi.waitFor(() => {
      const iframeElement = iframe.element() as HTMLIFrameElement
      const doc = iframeElement.contentDocument
      expect(doc?.body).not.toBeNull()
      // Check that the script was injected via onMount handler
      const scripts = doc?.querySelectorAll('script')
      expect(scripts?.length).toBeGreaterThan(0)
    })
  })

  it('should expose frameRef for external access', async () => {
    render(Script)

    await nextTick()

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      expect(iframeElement.contentDocument).not.toBeNull()
      expect(iframeElement.contentWindow).not.toBeNull()
    })
  })

  it('should set CSS variables for frame dimensions', async () => {
    render(Basic)

    await nextTick()

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      const heightVar = iframeElement.style.getPropertyValue('--height')
      const widthVar = iframeElement.style.getPropertyValue('--width')
      // Variables should be set (format: Xpx)
      expect(heightVar).toMatch(/^\d+px$/)
      expect(widthVar).toMatch(/^\d+px$/)
    })
  })

  it('should teleport content to frame-root element', async () => {
    render(Basic)

    await nextTick()

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      const doc = iframeElement.contentDocument
      const frameRoot = doc?.querySelector('.frame-root')
      expect(frameRoot).not.toBeNull()
      // Content should be inside frame-root
      const h1 = frameRoot?.querySelector('h1')
      expect(h1?.textContent).toContain('Hello from inside the frame!')
    })
  })
})
