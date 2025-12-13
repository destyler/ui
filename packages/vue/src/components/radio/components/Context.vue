<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseRadioContext } from '../composables/use-radio-context'

export interface RadioContextProps
  extends SlotsType<{
    default: UnwrapRef<UseRadioContext>
  }> {}
</script>

<script setup lang="ts">
import { useRadioContext } from '../composables/use-radio-context'

defineOptions({
  name: 'RadioContext'
})

const radio = useRadioContext()

defineSlots<{
  default(radio: UnwrapRef<UseRadioContext>): unknown
}>()
</script>

<template>
  <slot v-bind="radio"></slot>
</template>
