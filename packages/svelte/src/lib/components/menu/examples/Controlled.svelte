<script lang="ts">
  import { Menu } from '../index'
  let open = $state(false)
</script>
<button type="button" onclick={() => open = !open}>Trigger from the outside</button>
<Menu.Root bind:open><Menu.Trigger>Open menu</Menu.Trigger><Menu.Positioner><Menu.Content>
  <Menu.Item value="react">React</Menu.Item><Menu.Item value="solid">Solid</Menu.Item><Menu.Item value="vue">Vue</Menu.Item>
</Menu.Content></Menu.Positioner></Menu.Root>
