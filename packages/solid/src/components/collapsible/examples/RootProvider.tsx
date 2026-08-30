import { Collapsible, useCollapsible } from '@destyler-ui/solid/collapsible'

export function RootProvider() {
  const collapsible = useCollapsible()

  return (
    <>
      <span>{collapsible().visible ? 'Visible' : 'Hidden'}</span>

      <Collapsible.RootProvider value={collapsible}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.RootProvider>
    </>
  )
}
