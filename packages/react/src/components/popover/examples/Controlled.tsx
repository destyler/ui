import { useState } from 'react'
import { Popover } from '../index'

export function Controlled() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(!open)}>toggle</button>
      <Popover.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
        <Popover.Trigger>
          click me
          <Popover.Indicator />
        </Popover.Trigger>
        <Popover.Anchor>Anchor</Popover.Anchor>
        <Popover.Positioner>
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Content>
            <Popover.Title>title</Popover.Title>
            <Popover.Description>description</Popover.Description>
            <Popover.CloseTrigger>close</Popover.CloseTrigger>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </>
  )
}
