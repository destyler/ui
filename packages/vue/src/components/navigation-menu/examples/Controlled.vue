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

  <NavigationMenu.Root v-model="value">
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
