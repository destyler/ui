<script setup lang="ts">
import { Dynamic } from '../index'

const props = defineProps<{
  defaultValue?: string[]
  modelValue?: string[]
  readOnly?: boolean
}>()
</script>

<template>
  <Dynamic.Root v-bind="props">
    <Dynamic.Context v-slot="api">
      <output data-testid="value">{{ JSON.stringify(api.value) }}</output>
      <button type="button" @click="api.setValue(['Edited'])">Set value</button>
    </Dynamic.Context>
    <Dynamic.Input aria-label="Tag" />
    <Dynamic.HiddenInput />
  </Dynamic.Root>
</template>
