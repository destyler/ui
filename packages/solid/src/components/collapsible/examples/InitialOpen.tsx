import { Collapsible } from '@destyler-ui/solid/collapsible'

export function InitialOpen() {
  return (
    <Collapsible.Root open>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  )
}
