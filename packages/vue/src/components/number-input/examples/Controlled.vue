<script setup lang="ts">
import { NumberInput } from '../index'
import { ref } from 'vue'

const value = ref('12')
</script>

<template>
  <output>{{ value }}</output>
  <NumberInput.Root v-model="value">
    <NumberInput.Label>
      Label:
      <NumberInput.ValueText />
    </NumberInput.Label>
    <NumberInput.Input />
    <NumberInput.Scrubber />
    <NumberInput.Control>
      <NumberInput.DecrementTrigger>-1</NumberInput.DecrementTrigger>
      <NumberInput.IncrementTrigger>+1</NumberInput.IncrementTrigger>
    </NumberInput.Control>
  </NumberInput.Root>
</template>
