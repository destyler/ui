<script setup lang="ts">
import { Collapse, useCollapse } from '~/index'
import { ref } from 'vue'

const items = ref(['React', 'Solid', 'Vue'])

const accordion = useCollapse({ defaultValue: ['React'] })
</script>

<template>
  <button @click="accordion.setValue(['Vue'])">Set to Vue</button>

  <Collapse.RootProvider :value="accordion">
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
