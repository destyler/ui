import { AspectRatio } from '../index'

export function Square() {
  return (
    <main style={{ width: '200px' }}>
      <AspectRatio.Root ratio={1}>
        <AspectRatio.Content>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
          }}
          >
            1:1
          </div>
        </AspectRatio.Content>
      </AspectRatio.Root>
    </main>
  )
}
