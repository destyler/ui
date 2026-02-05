import { Popover, usePopover } from '../index'

export function RootProvider() {
  const popover = usePopover()

  return (
    <>
      <button onClick={() => popover.setOpen(true)}>Open</button>

      <Popover.RootProvider value={popover}>
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
      </Popover.RootProvider>
    </>
  )
}
