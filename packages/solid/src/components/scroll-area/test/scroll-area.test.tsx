import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { ScrollArea, scrollAreaAnatomy } from '..'
import { getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'
import { Controlled } from '../examples/Controlled'
import { RootProvider } from '../examples/RootProvider'
import { VirtualScroll } from '../examples/VirtualScroll'

describe('scrollArea / Parts & Exports', () => {
  it.each(getParts(scrollAreaAnatomy))('should render part %s', (part) => {
    render(() => <Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(scrollAreaAnatomy))('should export %s', (part) => {
    expect(ScrollArea[part]).toBeDefined()
  })
})

describe('scrollArea', () => {
  it('renders content and passes scrollbar orientation to each thumb', () => {
    const result = render(() => <Basic />)
    expect(screen.getByText('Tags')).toBeVisible()
    expect(screen.getByText('v1.2.0-beta.50')).toBeVisible()

    const verticalThumb = result.container.querySelector(
      '[data-part="scrollbar"][data-orientation="vertical"] [data-part="thumb"]',
    )
    const horizontalThumb = result.container.querySelector(
      '[data-part="scrollbar"][data-orientation="horizontal"] [data-part="thumb"]',
    )
    expect(verticalThumb).toHaveAttribute('data-orientation', 'vertical')
    expect(horizontalThumb).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('applies the initial scroll position after mounting', async () => {
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo')
    render(() => (
      <ScrollArea.Root defaultScrollTop={24} defaultScrollLeft={8}>
        <ScrollArea.Viewport>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    ))

    await waitFor(() =>
      expect(scrollTo).toHaveBeenCalledWith({ top: 24, left: 8, behavior: 'auto' }),
    )
    scrollTo.mockRestore()
  })

  it('reports scroll changes and exposes the RootProvider api', async () => {
    const onScroll = vi.fn()
    const result = render(() => (
      <ScrollArea.Root onScroll={onScroll}>
        <ScrollArea.Viewport>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    ))
    const viewport = result.container.querySelector('[data-part="viewport"]') as HTMLElement
    Object.defineProperty(viewport, 'scrollTop', { configurable: true, value: 37 })
    Object.defineProperty(viewport, 'scrollLeft', { configurable: true, value: 9 })
    fireEvent.scroll(viewport)
    await waitFor(() =>
      expect(onScroll).toHaveBeenCalledWith(
        expect.objectContaining({ scrollTop: 37, scrollLeft: 9 }),
      ),
    )
    result.unmount()

    render(() => <RootProvider />)
    expect(screen.getByText('Scroll to Bottom')).toBeVisible()
  })

  it('renders virtual content', async () => {
    const result = render(() => <VirtualScroll />)
    expect(screen.getByText(/Rendering 10000 items efficiently/)).toBeVisible()
    expect(screen.getByText('Scroll to Middle')).toBeVisible()
    await waitFor(() =>
      expect(result.container.querySelector('[data-part="content"] > div')).toBeInTheDocument(),
    )
  })

  it('disconnects the core resize observer on unmount', async () => {
    const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
    const result = render(() => <Controlled />)

    result.unmount()

    await waitFor(() => expect(disconnect).toHaveBeenCalled())
    disconnect.mockRestore()
  })
})
