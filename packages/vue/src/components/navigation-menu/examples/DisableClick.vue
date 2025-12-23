<script setup lang="ts">
import { NavigationMenu } from '../index'
</script>

<template>
  <NavigationMenu.Root disable-click-trigger>
    <NavigationMenu.List>
      <NavigationMenu.Item value="getting-started">
        <NavigationMenu.Trigger value="getting-started">
          Getting started
        </NavigationMenu.Trigger>
      </NavigationMenu.Item>

      <NavigationMenu.Item value="components">
        <NavigationMenu.Trigger value="components">
          Components
        </NavigationMenu.Trigger>
      </NavigationMenu.Item>

      <NavigationMenu.Item value="docs">
        <NavigationMenu.Link value="docs" href="#">
          Documentation
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Indicator>
        <NavigationMenu.Arrow />
      </NavigationMenu.Indicator>
    </NavigationMenu.List>

    <NavigationMenu.ViewportPositioner>
      <NavigationMenu.Viewport>
        <NavigationMenu.Content value="getting-started">
          <NavigationMenu.Link value="intro" href="#">Introduction</NavigationMenu.Link>
          <NavigationMenu.Link value="install" href="#">Installation</NavigationMenu.Link>
        </NavigationMenu.Content>

        <NavigationMenu.Content value="components">
          <NavigationMenu.Link value="button" href="#">Button</NavigationMenu.Link>
          <NavigationMenu.Link value="dialog" href="#">Dialog</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Viewport>
    </NavigationMenu.ViewportPositioner>
  </NavigationMenu.Root>
</template>
