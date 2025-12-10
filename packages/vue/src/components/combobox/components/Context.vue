<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseComboboxContext } from '../composables/use-combobox-context'

export interface ComboboxContextProps
  extends SlotsType<{
    default: UnwrapRef<UseComboboxContext>
  }> {}
</script>

<script setup lang="ts">
import { useComboboxContext } from '../composables/use-combobox-context'

defineOptions({
  name: 'ComboboxContext',
})

const combobox = useComboboxContext()

defineSlots<{
  default(combobox: UnwrapRef<UseComboboxContext>): unknown
}>()
</script>

<template>
  <slot v-bind="combobox"></slot>
</template>
