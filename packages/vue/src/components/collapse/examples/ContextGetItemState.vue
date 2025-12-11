<script setup lang="ts">
import { Collapse } from '~/index'
import { ref } from 'vue'

const items = ref([{ value: 'React' }, { value: 'Solid', disabled: true }, { value: 'Vue' }])
</script>

<template>
  <Collapse.Root :defaultValue="['React']">
    <Collapse.Context v-slot="context">
      <b>Vue State:</b>
      <span>Disabled: {{ context.getItemState(items[2]).disabled ? 'Y' : 'N' }}</span>
      <span>Expanded: {{ context.getItemState(items[2]).expanded ? 'Y' : 'N' }}</span>
      <span>Focused: {{ context.getItemState(items[2]).focused ? 'Y' : 'N' }}</span>
    </Collapse.Context>
    <Collapse.Item v-for="item in items" :key="item.value" v-bind="item">
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
