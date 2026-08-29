<script lang="ts">
  import { Menu } from '../index'
  const items = ['React', 'Solid', 'Vue']
  let value = $state('React')
</script>
<Menu.Root><Menu.Trigger>Open menu</Menu.Trigger><Menu.Positioner><Menu.Content><Menu.RadioItemGroup bind:value>
  <Menu.ItemGroupLabel>JS Frameworks</Menu.ItemGroupLabel>
  {#each items as item}<Menu.RadioItem value={item}><Menu.ItemIndicator>✅</Menu.ItemIndicator><Menu.ItemText>{item}</Menu.ItemText></Menu.RadioItem>{/each}
</Menu.RadioItemGroup></Menu.Content></Menu.Positioner></Menu.Root>
