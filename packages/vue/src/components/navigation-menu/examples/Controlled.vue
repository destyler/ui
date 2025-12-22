<script setup lang="ts">
import { ref } from 'vue'
import { NavigationMenu } from '../index'

const value = ref<string | null>(null)
</script>

<template>
  <div>
    <p>Current value: {{ value ?? 'none' }}</p>
    <button @click="value = 'getting-started'">Open Getting Started</button>
    <button @click="value = 'components'">Open Components</button>
    <button @click="value = null">Close All</button>
  </div>

  <NavigationMenu.Root v-model:value="value">
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

<style scoped>
[data-scope="navigation-menu"][data-part="root"] {
  position: relative;
}

[data-scope="navigation-menu"][data-part="list"] {
  display: flex;
  list-style: none;
  padding: 4px;
  margin: 0;
  gap: 4px;
  background: #f5f5f5;
  border-radius: 4px;
}

[data-scope="navigation-menu"][data-part="trigger"],
[data-scope="navigation-menu"][data-part="link"] {
  padding: 8px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
}

[data-scope="navigation-menu"][data-part="trigger"]:hover,
[data-scope="navigation-menu"][data-part="link"]:hover {
  background: #e5e5e5;
}

[data-scope="navigation-menu"][data-part="viewport-positioner"] {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding-top: 8px;
}

[data-scope="navigation-menu"][data-part="viewport"] {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

[data-scope="navigation-menu"][data-part="content"] {
  padding: 12px;
}

[data-scope="navigation-menu"][data-part="content"][hidden] {
  display: none;
}

[data-scope="navigation-menu"][data-part="content"] [data-part="link"] {
  display: block;
  padding: 8px;
  margin: 4px 0;
}
</style>
