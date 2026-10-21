import type { InteractOutsideEvent } from '@destyler/menu'
import { Menu } from '@destyler-ui/solid/menu'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [isOpen, setIsOpen] = createSignal(false)
  let externalTrigger: HTMLButtonElement | undefined

  function handleInteractOutside(event: InteractOutsideEvent) {
    const target = event.detail.originalEvent.target
    // This button owns the toggle; outside pointerdown/focus must not close
    // the menu before its click toggles it back open.
    if (target instanceof Node && externalTrigger?.contains(target))
      event.preventDefault()
  }

  return (
    <>
      <button ref={externalTrigger} type="button" onClick={() => setIsOpen(!isOpen())}>
        Trigger from the outside
      </button>
      <Menu.Root
        open={isOpen()}
        onInteractOutside={handleInteractOutside}
        onOpenChange={({ open }) => setIsOpen(open)}
        onSelect={id => console.warn(id)}
      >
        <Menu.Trigger>
          Open menu <Menu.Indicator>➡️</Menu.Indicator>
        </Menu.Trigger>
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
