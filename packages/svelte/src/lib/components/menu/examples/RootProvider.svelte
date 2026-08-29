<script lang="ts">
  import { Menu, useMenu } from '../index'
  const id = $props.id()
  const menu = useMenu({ id })
</script>
<button type="button" onclick={() => menu().api.setHighlightedValue('solid')}>Highlight Solid</button>
<Menu.RootProvider value={menu}><Menu.Trigger>Open menu <Menu.Indicator /></Menu.Trigger><Menu.Positioner><Menu.Content>
  <Menu.Item value="react">React</Menu.Item><Menu.Item value="solid">Solid</Menu.Item><Menu.Item value="vue">Vue</Menu.Item>
</Menu.Content></Menu.Positioner></Menu.RootProvider>
