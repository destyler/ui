import { Popover } from '../index'

export function OnOpenChange() {
  return (
    // eslint-disable-next-line no-console
    <Popover.Root onOpenChange={({ open }) => console.log(open ? 'opened' : 'closed')}>
      <Popover.Trigger>
        Click Me
        <Popover.Indicator>
          {'>'}
        </Popover.Indicator>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Title>Title</Popover.Title>
          <Popover.Description>Description</Popover.Description>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
