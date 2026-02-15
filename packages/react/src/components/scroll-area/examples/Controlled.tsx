import { useState, useEffect } from 'react'
import { ScrollArea, useScrollArea } from '../index'

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)

export function Controlled() {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollArea = useScrollArea({ id: 'controlled-scroll-area' })

  useEffect(() => {
    setScrollTop(scrollArea.scrollTop)
  }, [scrollArea.scrollTop])

  const scrollToTop = () => {
    scrollArea.scrollTo({ top: 0 })
  }

  const scrollToBottom = () => {
    scrollArea.scrollTo({ top: 9999 })
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={scrollToTop} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Scroll to Top
        </button>
        <button onClick={scrollToBottom} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Scroll to Bottom
        </button>
        <span>
          Scroll Position:
          {scrollTop.toFixed(0)}
          px
        </span>
      </div>

      <ScrollArea.RootProvider
        value={scrollArea}
        style={{ width: '200px', height: '300px', border: '1px solid #ccc' }}
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Tags (Controlled)</h3>
              {tags.map(tag => (
                <div key={tag} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  {tag}
                </div>
              ))}
            </div>
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
