import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { useScrollAreaContext } from '../hooks/use-scroll-area-context'
import { ScrollArea, scrollAreaAnatomy } from '../index'

describe('[scroll-area] component', () => {
  it.each(getExports(scrollAreaAnatomy))('should export %s', async (part) => {
    expect(ScrollArea).toHaveProperty(part, expect.anything())
  })

  describe('basic functionality', () => {
    it('should render content inside viewport', async () => {
      render(<Basic />)
      await expect.element(page.getByText('Tags')).toBeInTheDocument()
    })

    it('seeds native scroll position once and keeps later user and API scrolling', async () => {
      const onScroll = vi.fn()
      function ScrollState() {
        const api = useScrollAreaContext()
        return (
          <>
            <output data-testid="initial-scroll-state">{api.scrollTop},{api.scrollLeft}</output>
            <button type="button" onClick={() => api.scrollTo({ top: 80, left: 40 })}>Scroll with API</button>
          </>
        )
      }
      function InitialScroll({ top, left }: { top: number, left: number }) {
        return (
          <ScrollArea.Root defaultScrollTop={top} defaultScrollLeft={left} onScroll={onScroll}>
            <ScrollArea.Viewport data-testid="initial-scroll-viewport" style={{ width: 100, height: 100 }}>
              <ScrollArea.Content style={{ width: 1000, height: 1000 }}>Scrollable content</ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollState />
          </ScrollArea.Root>
        )
      }

      const screen = await render(<InitialScroll top={24} left={8} />)
      const viewport = page.getByTestId('initial-scroll-viewport').element()
      const state = page.getByTestId('initial-scroll-state')
      await vi.waitFor(() => {
        expect(viewport.scrollTop).toBe(24)
        expect(viewport.scrollLeft).toBe(8)
      })
      await expect.element(state).toHaveTextContent('24,8')
      expect(onScroll).toHaveBeenLastCalledWith(expect.objectContaining({ scrollTop: 24, scrollLeft: 8 }))

      await screen.rerender(<InitialScroll top={48} left={16} />)
      expect(viewport.scrollTop).toBe(24)
      expect(viewport.scrollLeft).toBe(8)
      await userEvent.click(page.getByRole('button', { name: 'Scroll with API' }))
      await expect.element(state).toHaveTextContent('80,40')
      expect(viewport.scrollTop).toBe(80)
      expect(viewport.scrollLeft).toBe(40)

      viewport.scrollTop = 120
      viewport.scrollLeft = 60
      await expect.element(state).toHaveTextContent('120,60')
      await screen.rerender(<InitialScroll top={0} left={0} />)
      expect(viewport.scrollTop).toBe(120)
      expect(viewport.scrollLeft).toBe(60)
      await expect.element(state).toHaveTextContent('120,60')
    })
  })
})
