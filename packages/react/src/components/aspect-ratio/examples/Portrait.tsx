import { AspectRatio } from '../index'

export function Portrait() {
  return (
    <main style={{ width: '200px' }}>
      <AspectRatio.Root ratio={9 / 16}>
        <AspectRatio.Content>
          <img
            src="https://elonehoo.me/gallery/20_sun.jpg"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </AspectRatio.Content>
      </AspectRatio.Root>
    </main>
  )
}
