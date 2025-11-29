<script setup lang="ts">
import { Collapse } from '../index'
import { ref } from 'vue'

const items = ref(['React', 'Solid', 'Vue'])
</script>

<template>
  <Collapse.Root :defaultValue="['Vue']">
    <Collapse.Item v-for="item in items" :key="item" :value="item">
      <Collapse.ItemTrigger>
        {{ item }} trigger
        <Collapse.ItemIndicator>
          x
        </Collapse.ItemIndicator>
      </Collapse.ItemTrigger>
      <Collapse.ItemContent>{{ item }} Content</Collapse.ItemContent>
    </Collapse.Item>
  </Collapse.Root>
</template>
