<script setup lang="ts">
import { Collapsible } from '../index'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button type="button" @click="() => (open = true)">Open</button>
  <Collapsible.Root v-model:open="open">
    <Collapsible.Trigger>Toggle</Collapsible.Trigger>
    <Collapsible.Content>Content</Collapsible.Content>
  </Collapsible.Root>
</template>
