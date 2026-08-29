import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import VirtualScroll from '../examples/VirtualScroll.svelte'
import { ScrollArea, scrollAreaAnatomy } from '../index'

const componentExports = ScrollArea as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[scroll-area] component', () => {
  it.each(scrollAreaAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="scroll-area"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `ScrollArea.${exportName}`).toBeDefined()
  })

  it('renders content inside the viewport', async () => {
    const screen = await render(Basic)
    await expect.element(page.getByText('Tags')).toBeVisible()
    await expect.element(page.getByText('v1.2.0-beta.50')).toBeVisible()
    const root = screen.container.querySelector('[data-part="root"]') as HTMLElement
    const verticalScrollbar = screen.container.querySelector('[data-part="scrollbar"][data-orientation="vertical"]') as HTMLElement
    const thumb = verticalScrollbar.querySelector('[data-part="thumb"]') as HTMLElement
    expect(root.style.width).toBe('200px')
    expect(root.style.height).toBe('300px')
    expect(root.style.border).toBe('1px solid rgb(204, 204, 204)')
    expect(verticalScrollbar.style.width).toBe('8px')
    expect(verticalScrollbar.style.background).toBe('rgb(240, 240, 240)')
    expect(thumb.style.background).toBe('rgb(136, 136, 136)')
    expect(thumb.style.borderRadius).toBe('4px')
  })

  it('scrolls through the controlled api', async () => {
    const screen = await render(Controlled)
    const viewport = screen.container.querySelector('[data-part="viewport"]') as HTMLElement
    const firstButton = screen.getByText('Scroll to Top').element() as HTMLButtonElement
    const heading = screen.getByText('Tags (Controlled)').element() as HTMLHeadingElement
    const verticalScrollbar = screen.container.querySelector('[data-part="scrollbar"][data-orientation="vertical"]') as HTMLElement
    const thumb = verticalScrollbar.querySelector('[data-part="thumb"]') as HTMLElement
    const corner = screen.container.querySelector('[data-part="corner"]') as HTMLElement
    expect(firstButton.style.padding).toBe('8px 16px')
    expect(firstButton.style.cursor).toBe('pointer')
    expect(heading.style.margin).toBe('0px 0px 12px')
    expect(verticalScrollbar.style.width).toBe('8px')
    expect(thumb.style.borderRadius).toBe('4px')
    expect(corner.style.background).toBe('rgb(240, 240, 240)')
    await userEvent.click(screen.getByText('Scroll to Bottom'))
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
  })

  it('works through RootProvider and renders virtual content', async () => {
    const provider = await render(RootProvider)
    await expect.element(provider.getByText('Scroll to Bottom')).toBeVisible()
    expect((provider.getByText('Scroll to Top').element() as HTMLElement).style.padding).toBe('8px 16px')
    expect((provider.container.querySelector('[data-part="thumb"]') as HTMLElement).style.background).toBe('rgb(136, 136, 136)')
    provider.unmount()

    const virtual = await render(VirtualScroll)
    await expect.element(virtual.getByText(/Rendering 10000 items efficiently/)).toBeVisible()
    await expect.element(virtual.getByText('Scroll to Middle')).toBeVisible()
    const description = virtual.getByText(/Rendering 10000 items efficiently/).element() as HTMLParagraphElement
    const firstItem = virtual.container.querySelector('[data-part="content"] > div') as HTMLElement
    expect(description.style.margin).toBe('0px')
    expect((virtual.getByText('Scroll to Middle').element() as HTMLElement).style.padding).toBe('8px 16px')
    expect(firstItem.style.display).toBe('flex')
    expect(firstItem.style.alignItems).toBe('center')
  })

  it('disconnects the core resize observer on unmount', async () => {
    const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
    const screen = await render(Basic)

    screen.unmount()

    await vi.waitFor(() => expect(disconnect).toHaveBeenCalled())
    disconnect.mockRestore()
  })
})
