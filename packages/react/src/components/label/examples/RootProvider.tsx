import { Label, useLabel } from '../index'

export function RootProvider() {
  const label = useLabel()

  return (
    <main>
      <Label.RootProvider value={label}>
        Email Address
      </Label.RootProvider>
    </main>
  )
}
