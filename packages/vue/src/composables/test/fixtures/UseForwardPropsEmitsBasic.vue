<script setup lang="ts">
import { useForwardPropsEmits } from '~/composables/use-forward-props-emits'

const props = defineProps<{
  label: string
}>()

const emit = defineEmits<{
  update: [value: string]
}>()

const forwarded = useForwardPropsEmits(props, emit)

function handleClick() {
  forwarded.value.onUpdate?.('clicked')
}
</script>

<template>
  <div>
    <span data-testid="label">{{ forwarded.label }}</span>
    <button data-testid="button" @click="handleClick">
      Click
    </button>
  </div>
</template>
