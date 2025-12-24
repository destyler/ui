import { AspectRatio } from '../index'

export function Square() {
  return (
    <main style={{ width: 200 }}>
      <AspectRatio.Root ratio={1}>
        <AspectRatio.Content>
          <div
            style={{
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              fontSize: 24,
              height: '100%',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            1:1
          </div>
        </AspectRatio.Content>
      </AspectRatio.Root>
    </main>
  )
}
