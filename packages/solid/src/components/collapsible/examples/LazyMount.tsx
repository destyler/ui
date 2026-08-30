import { Collapsible } from '@destyler-ui/solid/collapsible'

export function LazyMount() {
  return (
    <Collapsible.Root lazyMount>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  )
}
