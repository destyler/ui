<script setup lang="ts">
import { Collapsible } from '../index'
</script>

<template>
  <Collapsible.Root :defaultOpen="true">
    <Collapsible.Trigger>Toggle</Collapsible.Trigger>
    <Collapsible.Content>Content</Collapsible.Content>
  </Collapsible.Root>
</template>
