import { Separator, useSeparator } from '@destyler-ui/solid/separator'

export function RootProvider() {
  const separator = useSeparator()

  return (
    <main style={{ width: '300px', padding: '1rem' }}>
      <div>
        <p>Destyler UI</p>
        <p>Unstyled components for Solid.</p>
      </div>
      <Separator.RootProvider value={separator}>
        <Separator.Root />
      </Separator.RootProvider>
    </main>
  )
}
