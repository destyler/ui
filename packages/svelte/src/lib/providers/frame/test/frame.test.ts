import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Script from '../examples/Script.svelte'
import SrcDoc from '../examples/SrcDoc.svelte'

describe('[frame] provider', () => {
  it('renders content inside the iframe', async () => {
    render(Basic)
    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      expect(iframeElement.contentDocument?.body.textContent).toContain('Hello from inside the frame!')
    })
  })

  it('renders content with custom srcDoc', async () => {
    render(SrcDoc)
    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      expect(iframeElement.contentDocument).not.toBeNull()
      expect(iframeElement.contentDocument?.querySelectorAll('link').length).toBeGreaterThan(0)
    })
  })

  it('executes onMount callback', async () => {
    render(Script)
    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      expect(iframeElement.contentDocument).not.toBeNull()
      expect(iframeElement.contentDocument?.querySelectorAll('script').length).toBeGreaterThan(0)
    })
  })
})
