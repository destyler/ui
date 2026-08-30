import { For } from 'solid-js'
import { ScrollArea, useScrollArea } from '../index'

const itemCount = 10_000
const itemSize = 40

export function VirtualScroll() {
  const scrollArea = useScrollArea({
    virtual: { count: itemCount, itemSize, overscan: 5 },
  })

  return (
    <main style={{ 'display': 'flex', 'flex-direction': 'column', 'gap': '16px' }}>
      <p style={{ margin: '0' }}>
        Rendering {itemCount} items efficiently with virtual scrolling (only{' '}
        {scrollArea().getVirtualItems().length} DOM nodes)
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={() => scrollArea().scrollToIndex(0)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Scroll to Start
        </button>
        <button
          type="button"
          onClick={() => scrollArea().scrollToIndex(Math.floor(itemCount / 2))}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Scroll to Middle
        </button>
        <button
          type="button"
          onClick={() => scrollArea().scrollToIndex(itemCount - 1)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Scroll to End
        </button>
      </div>

      <ScrollArea.RootProvider
        value={scrollArea}
        style={{ width: '300px', height: '400px', border: '1px solid #ccc' }}
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content
            style={{ height: `${scrollArea().getTotalSize()}px`, position: 'relative' }}
          >
            <For each={scrollArea().getVirtualItems()}>
              {item => (
                <div
                  style={{
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'width': '100%',
                    'height': `${itemSize}px`,
                    'transform': `translateY(${item.start}px)`,
                    'padding': '8px 16px',
                    'border-bottom': '1px solid #eee',
                    'display': 'flex',
                    'align-items': 'center',
                    'box-sizing': 'border-box',
                  }}
                >
                  Item {item.index + 1}
                </div>
              )}
            </For>
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
