import { Collapsible } from '@destyler-ui/solid/collapsible'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [open, setOpen] = createSignal(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open</button>
      <Collapsible.Root open={open()} onOpenChange={({ open }) => setOpen(open)}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>
    </>
  )
}
