<script setup lang="ts">
import * as navigationMenu from '@destyler/navigation-menu'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(navigationMenu.machine({
  id: useId(),
}))

const api = computed(() => navigationMenu.connect(state.value, send, normalizeProps))
</script>

<template>
  <main class="main">
    <div>Debug: open = {{ api.open }}, value = {{ api.value }}</div>
    <nav v-bind="api.getRootProps()" class="nav-root">
      <ul v-bind="api.getListProps()" class="nav-list">
        <li v-bind="api.getItemProps({ value: 'getting-started' })">
          <button v-bind="api.getTriggerProps({ value: 'getting-started' })" class="nav-trigger">
            Getting started
          </button>
        </li>
        <li v-bind="api.getItemProps({ value: 'components' })">
          <button v-bind="api.getTriggerProps({ value: 'components' })" class="nav-trigger">
            Components
          </button>
        </li>
      </ul>

      <div v-bind="api.getViewportPositionerProps()" class="nav-viewport-wrapper">
        <div v-if="api.open" v-bind="api.getViewportProps()" class="nav-viewport">
          <div v-bind="api.getContentProps({ value: 'getting-started' })" class="nav-content">
            <p>Getting Started Content Here!</p>
          </div>
          <div v-bind="api.getContentProps({ value: 'components' })" class="nav-content">
            <p>Components Content Here!</p>
          </div>
        </div>
      </div>
    </nav>
  </main>
</template>

<style scoped>
.main {
  padding: 40px;
}
.nav-root {
  position: relative;
}
.nav-list {
  display: flex;
  list-style: none;
  padding: 4px;
  margin: 0;
  background: #fff;
  border-radius: 6px;
}
.nav-trigger {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}
.nav-trigger:hover {
  background: #f0f0f0;
}
.nav-trigger[data-state="open"] {
  background: #e0e0e0;
}
.nav-viewport-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
}
.nav-viewport {
  margin-top: 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.nav-content {
  position: absolute;
  top: 0;
  left: 0;
  padding: 16px;
}
.nav-content[data-state="closed"] {
  display: none;
}
</style>
