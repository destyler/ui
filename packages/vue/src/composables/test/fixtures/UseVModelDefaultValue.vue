<script setup lang="ts">
import { useVModel } from '~/composables/use-v-model'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = useVModel(props, 'modelValue', emit, {
  defaultValue: 'default-value',
})
</script>

<template>
  <input
    data-testid="input"
    :value="value"
    @input="value = ($event.target as HTMLInputElement).value"
  >
</template>
