import { AspectRatio, useAspectRatio } from '../index'

export function RootProvider() {
  const aspectRatio = useAspectRatio({ ratio: 4 / 3 })

  return (
    <main style={{ width: 300 }}>
      <AspectRatio.RootProvider value={aspectRatio}>
        <AspectRatio.Content>
          <img
            alt="Root provider aspect ratio example"
            src="https://elonehoo.me/gallery/20_sun.jpg"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </AspectRatio.Content>
      </AspectRatio.RootProvider>
    </main>
  )
}
