<script setup lang="ts">
import { Radio } from '../index'
import { ref } from 'vue'

const value = ref('vue')
const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte', disabled: true },
]
</script>

<template>
  <output>{{ value }}</output>
  <Radio.Root v-model="value">
    <Radio.Label>Framework</Radio.Label>
    <Radio.Indicator />
    <Radio.Item v-for="item in items" :key="item.value" :value="item.value" :disabled="item.disabled">
      <Radio.ItemText>{{ item.label }}</Radio.ItemText>
      <Radio.ItemControl />
      <Radio.ItemHiddenInput />
    </Radio.Item>
  </Radio.Root>
</template>
