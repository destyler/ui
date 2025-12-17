<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseToggleGroupContext } from '../composables/use-toggle-group-context'

export interface ToggleGroupContextProps
  extends SlotsType<{
    default: UnwrapRef<UseToggleGroupContext>
  }> {}
</script>

<script setup lang="ts">
import { useToggleGroupContext } from '../composables/use-toggle-group-context'

defineOptions({
  name: 'ToggleGroupContext'
})

const toggleGroup = useToggleGroupContext()

defineSlots<{
  default(toggleGroup: UnwrapRef<UseToggleGroupContext>): unknown
}>()
</script>

<template>
  <slot v-bind="toggleGroup"></slot>
</template>
