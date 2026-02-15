import { ScrollArea, useScrollArea } from '../index'

const itemCount = 10000
const itemSize = 40

export function VirtualScroll() {
  const scrollArea = useScrollArea({
    virtual: {
      count: itemCount,
      itemSize,
      overscan: 5,
    },
  })

  const virtualItems = scrollArea.getVirtualItems()
  const totalSize = scrollArea.getTotalSize()

  const scrollToStart = () => {
    scrollArea.scrollToIndex(0)
  }

  const scrollToMiddle = () => {
    scrollArea.scrollToIndex(Math.floor(itemCount / 2))
  }

  const scrollToEnd = () => {
    scrollArea.scrollToIndex(itemCount - 1)
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ margin: 0 }}>
        Rendering
        {itemCount}
        {' '}
        items efficiently with virtual scrolling (only
        {virtualItems.length}
        {' '}
        DOM nodes)
      </p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={scrollToStart} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Scroll to Start
        </button>
        <button onClick={scrollToMiddle} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Scroll to Middle
        </button>
        <button onClick={scrollToEnd} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Scroll to End
        </button>
      </div>

      <ScrollArea.RootProvider
        value={scrollArea}
        style={{ width: '300px', height: '400px', border: '1px solid #ccc' }}
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            {virtualItems.map(item => (
              <div
                key={item.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${itemSize}px`,
                  transform: `translateY(${item.start}px)`,
                  padding: '8px 16px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                Item
                {item.index + 1}
              </div>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical" style={{ width: '8px', background: '#f0f0f0' }}>
          <ScrollArea.Thumb style={{ background: '#888', borderRadius: '4px' }} />
        </ScrollArea.Scrollbar>

        <ScrollArea.Scrollbar orientation="horizontal" style={{ height: '8px', background: '#f0f0f0' }}>
          <ScrollArea.Thumb style={{ background: '#888', borderRadius: '4px' }} />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner style={{ background: '#f0f0f0' }} />
      </ScrollArea.RootProvider>
    </main>
  )
}
