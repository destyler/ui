<script setup lang="ts">
import { useEmitAsProps } from '~/composables/use-emits-as-props'

const emit = defineEmits<{
  click: []
  change: [value: string]
  focus: []
  blur: []
  custom: [value: string, num: number]
}>()

const emitAsProps = useEmitAsProps(emit)

function handleClick() {
  emitAsProps.onClick?.()
}

function handleFocus() {
  emitAsProps.onFocus?.()
}

function handleBlur() {
  emitAsProps.onBlur?.()
}

function handleCustom() {
  emitAsProps.onCustom?.('custom-value', 123)
}
</script>

<template>
  <div>
    <button data-testid="button" @click="handleClick">
      Click me
    </button>
    <input data-testid="input" @focus="handleFocus" @blur="handleBlur">
    <button data-testid="custom-button" @click="handleCustom">
      Custom Event
    </button>
  </div>
</template>
