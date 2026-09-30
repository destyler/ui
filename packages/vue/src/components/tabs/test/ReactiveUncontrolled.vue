<script setup lang="ts">
import { Tabs } from '../index'
import { ref } from 'vue'

const orientation = ref<'horizontal' | 'vertical'>('horizontal')
const items = [
  { value: 'React' },
  { value: 'Solid' },
  { value: 'Vue' },
]
</script>

<template>
  <Tabs.Root default-value="React" :orientation="orientation">
    <Tabs.List>
      <Tabs.Trigger v-for="item in items" :key="item.value" :value="item.value">
        {{ item.value }} Trigger
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content v-for="item in items" :key="item.value" :value="item.value">
      {{ item.value }} Content
    </Tabs.Content>
  </Tabs.Root>
  <button type="button" @click="orientation = 'vertical'">
    vertical
  </button>
</template>
