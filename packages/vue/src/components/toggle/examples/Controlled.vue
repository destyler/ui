<script setup lang="ts">
import { Toggle } from '../index'
import { ref } from 'vue'

const pressed = ref(false)
</script>

<template>
  <output>{{ pressed }}</output>
  <Toggle.Root v-model="pressed">
    <Toggle.Indicator>✓</Toggle.Indicator>
    Toggle
  </Toggle.Root>
</template>
