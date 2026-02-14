import { AspectRatio } from '../index'

export function Basic() {
  return (
    <main style={{ width: '300px' }}>
      <AspectRatio.Root ratio={16 / 9}>
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
