import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { Basic } from '../examples/Basic'
import { Script } from '../examples/Script'
import { SrcDoc } from '../examples/SrcDoc'

describe('[frame] provider', () => {
  it('should render content inside the iframe', async () => {
    render(<Basic />)

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()
  })

  it('should render content with custom srcDoc', async () => {
    render(<SrcDoc />)

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

  it('should execute onMount callback', async () => {
    render(<Script />)

    const iframe = page.getByTitle('Custom Frame')
    await expect.element(iframe).toBeVisible()

    const iframeElement = iframe.element() as HTMLIFrameElement
    await vi.waitFor(() => {
      const doc = iframeElement.contentDocument
      expect(doc).not.toBeNull()
      // Check that script was added
      const scripts = doc?.querySelectorAll('script')
      expect(scripts?.length).toBeGreaterThan(0)
    })
  })
})
