<script setup lang="ts">
import { Radio } from '../index'
import { ref } from 'vue'

const frameworks = ref(['React', 'Solid', 'Vue'])
</script>

<template>
  <Radio.Root @value-change="(details) => console.log(details.value)">
    <Radio.Label>Framework</Radio.Label>
    <Radio.Indicator />
    <Radio.Item v-for="framework in frameworks" :key="framework" :value="framework">
      <Radio.ItemText>{{ framework }}</Radio.ItemText>
      <Radio.ItemControl />
      <Radio.ItemHiddenInput />
    </Radio.Item>
  </Radio.Root>
</template>
