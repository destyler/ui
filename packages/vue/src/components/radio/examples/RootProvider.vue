<script setup lang="ts">
import { Radio, useRadio } from '../index'
import { ref } from 'vue'

const frameworks = ref(['React', 'Solid', 'Vue'])

const radio = useRadio()
</script>

<template>
  <button @click="radio.focus()">Focus</button>

  <Radio.RootProvider :value="radio">
    <Radio.Label>Framework</Radio.Label>
    <Radio.Indicator />
    <Radio.Item v-for="framework in frameworks" :key="framework" :value="framework">
      <Radio.ItemText>{{ framework }}</Radio.ItemText>
      <Radio.ItemControl />
      <Radio.ItemHiddenInput />
    </Radio.Item>
  </Radio.RootProvider>
</template>
