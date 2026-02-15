import { ScrollArea } from '../index'

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)

export function Basic() {
  return (
    <ScrollArea.Root style={{ width: '200px', height: '300px', border: '1px solid #ccc' }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Tags</h3>
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
    </ScrollArea.Root>
  )
}
