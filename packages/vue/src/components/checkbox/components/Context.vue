<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseCheckboxContext } from '../composables/use-checkbox-context'

export interface CheckboxContextProps
  extends SlotsType<{
    default: UnwrapRef<UseCheckboxContext>
  }> {}
</script>

<script setup lang="ts">
import { useCheckboxContext } from '../composables/use-checkbox-context'

defineOptions({
  name: 'CheckboxContext'
})

const checkbox = useCheckboxContext()

defineSlots<{
  default(checkbox: UnwrapRef<UseCheckboxContext>): unknown
}>()
</script>

<template>
  <slot v-bind="checkbox"></slot>
</template>
