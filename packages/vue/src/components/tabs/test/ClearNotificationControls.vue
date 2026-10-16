<script setup lang="ts">
import { Tabs } from '../index'
</script>

<template>
  <Tabs.Context v-slot="tabs">
    <button data-action="api-clear" @click="tabs.clearValue()">API clear</button>
    <button data-action="api-alpha" @click="tabs.setValue('alpha')">API select alpha</button>
    <button data-action="api-beta" @click="tabs.setValue('beta')">API select beta</button>
    <output data-value="api">{{ tabs.value ?? 'none' }}</output>
  </Tabs.Context>
  <Tabs.List>
    <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
    <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="alpha">Alpha content</Tabs.Content>
  <Tabs.Content value="beta">Beta content</Tabs.Content>
</template>
