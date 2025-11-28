<script setup lang="ts">
import { Collapse } from '../index'
import { ref } from 'vue'

const items = ref(['React', 'Solid', 'Vue'])
const value = ref(['React'])
</script>

<template>
  {{ value }}
  <Collapse.Root v-model="value">
    <Collapse.Item v-for="item in items" :key="item" :value="item">
      <Collapse.ItemTrigger>{{ item }} trigger</Collapse.ItemTrigger>
      <Collapse.ItemContent>{{ item }} content</Collapse.ItemContent>
    </Collapse.Item>
  </Collapse.Root>
</template>
