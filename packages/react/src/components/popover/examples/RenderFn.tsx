import { Popover } from '../index'

export function RenderFn() {
  return (
    <Popover.Root>
      <Popover.Trigger>Click Me</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Context>
          {popover => (
            <Popover.Content>
              <Popover.Title>Title</Popover.Title>
              <Popover.Description>Description: {popover.open.toString()}</Popover.Description>
              <Popover.CloseTrigger>Close</Popover.CloseTrigger>
            </Popover.Content>
          )}
        </Popover.Context>
      </Popover.Positioner>
    </Popover.Root>
  )
}
