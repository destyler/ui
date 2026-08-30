import { AspectRatio } from '@destyler-ui/solid/aspect-ratio'

export function Square() {
  return (
    <main style={{ width: '200px' }}>
      <AspectRatio.Root ratio={1}>
        <AspectRatio.Content>
          <div
            style={{
              'width': '100%',
              'height': '100%',
              'display': 'flex',
              'align-items': 'center',
              'justify-content': 'center',
              'color': 'white',
              'font-size': '24px',
              'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            1:1
          </div>
        </AspectRatio.Content>
      </AspectRatio.Root>
    </main>
  )
}
