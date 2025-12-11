<script setup lang="ts">
import { Collapse } from '~/index'
import { ref } from 'vue'

const items = ref(['React', 'Solid', 'Vue'])
</script>

<template>
  <Collapse.Root :defaultValue="['React']">
    <Collapse.Context v-slot="context">
      <span>Focused item: {{ context.focusedValue }}</span>
    </Collapse.Context>
    <Collapse.Item v-for="item in items" :key="item" :value="item">
      <Collapse.ItemTrigger>
        What is {{ item }}?
        <Collapse.ItemIndicator>
          x
        </Collapse.ItemIndicator>
      </Collapse.ItemTrigger>
      <Collapse.ItemContent>{{ item }} is a JavaScript library for building user interfaces.</Collapse.ItemContent>
    </Collapse.Item>
  </Collapse.Root>
</template>
