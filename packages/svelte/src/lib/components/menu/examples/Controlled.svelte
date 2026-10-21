<script lang="ts">
  import type { InteractOutsideEvent } from '@destyler/menu'
  import { Menu } from '../index'

  let open = $state(false)
  let externalTrigger: HTMLButtonElement | undefined

  function handleInteractOutside(event: InteractOutsideEvent) {
    const target = event.detail.originalEvent.target
    // This button owns the toggle; outside pointerdown/focus must not close
    // the menu before its click toggles it back open.
    if (target instanceof Node && externalTrigger?.contains(target))
      event.preventDefault()
  }
</script>

<button bind:this={externalTrigger} type="button" onclick={() => open = !open}>Trigger from the outside</button>
<Menu.Root bind:open onInteractOutside={handleInteractOutside}>
  <Menu.Trigger>Open menu</Menu.Trigger>
  <Menu.Positioner>
    <Menu.Content>
      <Menu.Item value="react">React</Menu.Item>
      <Menu.Item value="solid">Solid</Menu.Item>
      <Menu.Item value="vue">Vue</Menu.Item>
    </Menu.Content>
  </Menu.Positioner>
</Menu.Root>
