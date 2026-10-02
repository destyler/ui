import { Collapsible, Toggle, useToggleContext } from '@destyler-ui/solid'

function State() {
  const toggle = useToggleContext()
  return <span>{String(toggle().pressed)}</span>
}
export function Fixture(props: { changes: { pressed: boolean[], open: boolean[] } }) {
  return (
    <main>
      <Toggle.Root id="packed-toggle" defaultPressed={false} onPressedChange={value => props.changes.pressed.push(value)}><State /></Toggle.Root>
      <Collapsible.Root id="packed-collapse" defaultOpen={false} onOpenChange={details => props.changes.open.push(details.open)}>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Content>Packed content</Collapsible.Content>
      </Collapsible.Root>
    </main>
  )
}
