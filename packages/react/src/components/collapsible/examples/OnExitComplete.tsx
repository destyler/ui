import { Collapsible } from '../index'

export function OnExitComplete() {
  return (
    <Collapsible.Root onExitComplete={
      // eslint-disable-next-line no-alert
      () => alert('on exit')
    }
    >
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible.Root>
  )
}
