import type { InteractOutsideEvent } from '@destyler/menu'
import { useRef, useState } from 'react'
import { Menu } from '../index'

export function Controlled() {
  const [isOpen, setIsOpen] = useState(false)
  const externalTrigger = useRef<HTMLButtonElement>(null)

  function handleInteractOutside(event: InteractOutsideEvent) {
    const target = event.detail.originalEvent.target
    // This button owns the toggle; outside pointerdown/focus must not close
    // the menu before its click toggles it back open.
    if (target instanceof Node && externalTrigger.current?.contains(target))
      event.preventDefault()
  }

  return (
    <>
      <button ref={externalTrigger} type="button" onClick={() => setIsOpen(!isOpen)}>Trigger from the outside</button>
      <Menu.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)} onInteractOutside={handleInteractOutside}>
        <Menu.Trigger>Open menu</Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="react">React</Menu.Item>
            <Menu.Item value="solid">Solid</Menu.Item>
            <Menu.Item value="vue">Vue</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </>
  )
}
