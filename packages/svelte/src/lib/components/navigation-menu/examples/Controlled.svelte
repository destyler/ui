<script lang="ts">
  import { NavigationMenu } from '../index'
  let value = $state<string | null>(null)
</script>
<div>
  <p>Current value: {value ?? 'none'}</p>
  <button type="button" onclick={() => value = 'getting-started'}>Open Getting Started</button>
  <button type="button" onclick={() => value = 'components'}>Open Components</button>
  <button type="button" onclick={() => value = null}>Close All</button>
  <NavigationMenu.Root bind:value>
    <NavigationMenu.List>
      <NavigationMenu.Item value="getting-started"><NavigationMenu.Trigger value="getting-started">Getting started</NavigationMenu.Trigger></NavigationMenu.Item>
      <NavigationMenu.Item value="components"><NavigationMenu.Trigger value="components">Components</NavigationMenu.Trigger></NavigationMenu.Item>
      <NavigationMenu.Item value="docs"><NavigationMenu.Link value="docs" href="#">Documentation</NavigationMenu.Link></NavigationMenu.Item>
      <NavigationMenu.Indicator><NavigationMenu.Arrow /></NavigationMenu.Indicator>
    </NavigationMenu.List>
    <NavigationMenu.ViewportPositioner><NavigationMenu.Viewport>
      <NavigationMenu.Content value="getting-started"><NavigationMenu.Link value="intro" href="#">Introduction</NavigationMenu.Link><NavigationMenu.Link value="install" href="#">Installation</NavigationMenu.Link></NavigationMenu.Content>
      <NavigationMenu.Content value="components"><NavigationMenu.Link value="button" href="#">Button</NavigationMenu.Link><NavigationMenu.Link value="dialog" href="#">Dialog</NavigationMenu.Link></NavigationMenu.Content>
    </NavigationMenu.Viewport></NavigationMenu.ViewportPositioner>
  </NavigationMenu.Root>
</div>
