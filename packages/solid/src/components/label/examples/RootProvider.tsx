import { Label, useLabel } from '@destyler-ui/solid/label'

export function RootProvider() {
  const label = useLabel()

  return (
    <main>
      <Label.RootProvider value={label}>Email Address</Label.RootProvider>
    </main>
  )
}
