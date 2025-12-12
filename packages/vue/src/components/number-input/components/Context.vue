<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseNumberInputContext } from '../composables/use-number-input-context'

export interface NumberInputContextProps
  extends SlotsType<{
    default: UnwrapRef<UseNumberInputContext>
  }> {}
</script>

<script setup lang="ts">
import { useNumberInputContext } from '../composables/use-number-input-context'

defineOptions({
  name: 'NumberInputContext',
})

const numberInput = useNumberInputContext()

defineSlots<{
  default(numberInput: UnwrapRef<UseNumberInputContext>): unknown
}>()
</script>

<template>
  <slot v-bind="numberInput"></slot>
</template>
