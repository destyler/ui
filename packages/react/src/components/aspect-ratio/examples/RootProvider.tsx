import { AspectRatio, useAspectRatio } from '../index'

export function RootProvider() {
  const aspectRatio = useAspectRatio({ ratio: 4 / 3 })

  return (
    <main style={{ width: '300px' }}>
      <AspectRatio.RootProvider value={aspectRatio}>
        <AspectRatio.Content>
          <img
            src="https://elonehoo.me/gallery/20_sun.jpg"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </AspectRatio.Content>
      </AspectRatio.RootProvider>
    </main>
  )
}
