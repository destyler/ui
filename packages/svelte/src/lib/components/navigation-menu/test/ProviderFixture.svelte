<script lang="ts">
  import type { UseNavigationMenuProps } from '../hooks/use-navigation-menu.svelte'
  import { NavigationMenu, useNavigationMenu } from '../index'

  const props: UseNavigationMenuProps = $props()
  const api = useNavigationMenu(() => props)
</script>

<NavigationMenu.RootProvider value={api}>
  <NavigationMenu.List>
    <NavigationMenu.Item value="components"><NavigationMenu.Trigger value="components">Components</NavigationMenu.Trigger></NavigationMenu.Item>
  </NavigationMenu.List>
  <NavigationMenu.Content value="components">Provider content</NavigationMenu.Content>
  <output data-value={String(api().value)} data-open={String(api().getContentState({ value: 'components' }).open)}></output>
</NavigationMenu.RootProvider>
