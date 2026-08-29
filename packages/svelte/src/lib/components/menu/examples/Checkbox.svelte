<script lang="ts">
  import { Menu } from '../index'
  let checked = $state(true)
</script>
<Menu.Root><Menu.Trigger>Open menu</Menu.Trigger><Menu.Positioner><Menu.Content>
  <Menu.CheckboxItem bind:checked value="my-checkbox"><Menu.ItemIndicator>✅</Menu.ItemIndicator><Menu.ItemText>Check me</Menu.ItemText></Menu.CheckboxItem>
</Menu.Content></Menu.Positioner></Menu.Root>
