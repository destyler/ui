import { Collapsible } from '../index'

export function LazyMountAndUnmountOnExit() {
  return (
    <Collapsible.Root lazyMount unmountOnExit>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  )
}
