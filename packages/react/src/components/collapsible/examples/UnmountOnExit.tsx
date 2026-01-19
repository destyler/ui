import { Collapsible } from '../index'

export function UnmountOnExit() {
  return (
    <Collapsible.Root unmountOnExit>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  )
}
