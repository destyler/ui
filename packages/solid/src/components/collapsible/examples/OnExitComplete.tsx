import { Collapsible } from '@destyler-ui/solid/collapsible'

export function OnExitComplete() {
  return (
    <Collapsible.Root onExitComplete={() => console.warn('on exit')}>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  )
}
