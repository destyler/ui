import { AspectRatio, useAspectRatio } from '@destyler-ui/solid/aspect-ratio'

export function RootProvider() {
  const aspectRatio = useAspectRatio({ ratio: 4 / 3 })

  return (
    <main style={{ width: '300px' }}>
      <AspectRatio.RootProvider value={aspectRatio}>
        <AspectRatio.Content>
          <img
            src="https://elonehoo.me/gallery/20_sun.jpg"
            alt="Sunset"
            style={{ 'width': '100%', 'height': '100%', 'object-fit': 'cover' }}
          />
        </AspectRatio.Content>
      </AspectRatio.RootProvider>
    </main>
  )
}
