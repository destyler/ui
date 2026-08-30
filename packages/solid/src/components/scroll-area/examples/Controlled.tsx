import { createEffect, createSignal, For } from 'solid-js'
import { ScrollArea, useScrollArea } from '../index'

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

export function Controlled() {
  const [scrollTop, setScrollTop] = createSignal(0)
  const scrollArea = useScrollArea({ id: 'controlled-scroll-area' })

  createEffect(() => {
    setScrollTop(scrollArea().scrollTop)
  })

  const scrollToTop = () => {
    scrollArea().scrollTo({ top: 0 })
  }

  const scrollToBottom = () => {
    scrollArea().scrollTo({ top: 9999 })
  }

  return (
    <main style={{ 'display': 'flex', 'flex-direction': 'column', 'gap': '16px' }}>
      <div style={{ 'display': 'flex', 'gap': '8px', 'align-items': 'center' }}>
        <button
          type="button"
          onClick={scrollToTop}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Scroll to Top
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Scroll to Bottom
        </button>
        <span>Scroll Position: {scrollTop().toFixed(0)}px</span>
      </div>

      <ScrollArea.RootProvider
        value={scrollArea}
        style={{ width: '200px', height: '300px', border: '1px solid #ccc' }}
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Tags (Controlled)</h3>
              <For each={tags}>
                {tag => (
                  <div style={{ 'padding': '8px 0', 'border-bottom': '1px solid #eee' }}>
                    {tag}
                  </div>
                )}
              </For>
            </div>
          </ScrollArea.Content>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="vertical"
          style={{ width: '8px', background: '#f0f0f0' }}
        >
          <ScrollArea.Thumb style={{ 'background': '#888', 'border-radius': '4px' }} />
        </ScrollArea.Scrollbar>

        <ScrollArea.Scrollbar
          orientation="horizontal"
          style={{ height: '8px', background: '#f0f0f0' }}
        >
          <ScrollArea.Thumb style={{ 'background': '#888', 'border-radius': '4px' }} />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner style={{ background: '#f0f0f0' }} />
      </ScrollArea.RootProvider>
    </main>
  )
}
