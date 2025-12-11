<script setup lang="ts">
import { Collapse } from '~/index'
import { ref } from 'vue'

const items = ref(['React', 'Solid', 'Vue'])
</script>

<template>
  <Collapse.Root>
    <Collapse.Item v-for="item in items" :key="item" :value="item">
      <Collapse.ItemContext v-slot="{ expanded }">
        <Collapse.ItemTrigger>{{ expanded ? 'Expanded' : 'Closed' }}</Collapse.ItemTrigger>
        <Collapse.ItemContent>{{ item }} content</Collapse.ItemContent>
      </Collapse.ItemContext>
    </Collapse.Item>
  </Collapse.Root>
</template>
