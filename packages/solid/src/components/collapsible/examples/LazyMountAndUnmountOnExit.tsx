import { Collapsible } from '@destyler-ui/solid/collapsible'

export function LazyMountAndUnmountOnExit() {
  return (
    <Collapsible.Root lazyMount unmountOnExit>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  )
}
