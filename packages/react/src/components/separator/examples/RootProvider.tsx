import { Separator, useSeparator } from '../index'

export function RootProvider() {
  const separator = useSeparator()

  return (
    <main style={{ width: '300px', padding: '1rem' }}>
      <div>
        <p>Destyler UI</p>
        <p>Unstyled components for React.</p>
      </div>
      <Separator.RootProvider value={separator}>
        <Separator.Root />
      </Separator.RootProvider>
    </main>
  )
}
