<script setup lang="ts">
import { Collapse, useCollapse } from '../index'
import { ref } from 'vue'

const items = ref(['React', 'Solid', 'Vue'])

const collapse = useCollapse({ defaultValue: ['React'] })
</script>

<template>
  <button @click="collapse.setValue(['Vue'])">Set to Vue</button>

  <Collapse.RootProvider :value="collapse">
    <Collapse.Item v-for="item in items" :key="item" :value="item">
      <Collapse.ItemTrigger>
        What is {{ item }}?
        <Collapse.ItemIndicator>
          x
        </Collapse.ItemIndicator>
      </Collapse.ItemTrigger>
      <Collapse.ItemContent>{{ item }} is a JavaScript library for building user interfaces.</Collapse.ItemContent>
    </Collapse.Item>
  </Collapse.RootProvider>
</template>
