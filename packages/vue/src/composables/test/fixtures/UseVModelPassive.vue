<script setup lang="ts">
import { useVModel } from '~/composables/use-v-model'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <input
    data-testid="input"
    v-model="value"
  >
</template>
