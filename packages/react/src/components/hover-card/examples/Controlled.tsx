import { useState } from 'react'
import { HoverCard } from '../index'

export function Controlled() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open HoverCard</button>
      <HoverCard.Root open={open} onOpenChange={setOpen}>
        <HoverCard.Trigger>Hover me</HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            Content
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.Root>
    </>
  )
}
