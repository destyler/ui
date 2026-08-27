<script setup lang="ts">
import { ToggleGroup } from '../index'
import { ref } from 'vue'

const value = ref(['a'])
</script>

<template>
  <ToggleGroup.Root v-model="value">
    <ToggleGroup.Item value="a">A</ToggleGroup.Item>
    <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    <ToggleGroup.Item value="c">C</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>
