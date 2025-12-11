<script setup lang="ts">
import { Collapse } from '~/index'
import { ref } from 'vue'

const items = ref(['React', 'Solid', 'Vue'])
</script>

<template>
  <Collapse.Root>
    <Collapse.Item v-for="item in items" :key="item" :value="item" :disabled="item === 'React'">
      <Collapse.ItemTrigger>{{ item }} Trigger</Collapse.ItemTrigger>
      <Collapse.ItemContent>{{ item }} Content</Collapse.ItemContent>
    </Collapse.Item>
  </Collapse.Root>
</template>
