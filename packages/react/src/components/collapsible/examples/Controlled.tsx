import { useState } from 'react'
import { Collapsible } from '../index'

export function Controlled() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open</button>
      <Collapsible.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>
    </>
  )
}
