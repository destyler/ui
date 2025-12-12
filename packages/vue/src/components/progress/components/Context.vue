<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseProgressContext } from '../composables/use-progress-context'

export interface ProgressContextProps
  extends SlotsType<{
    default: UnwrapRef<UseProgressContext>
  }> {}
</script>

<script setup lang="ts">
import { useProgressContext } from '../composables/use-progress-context'

defineOptions({
  name: 'ProgressContext',
})

const progress = useProgressContext()

defineSlots<{
  default(progress: UnwrapRef<UseProgressContext>): unknown
}>()
</script>

<template>
  <slot v-bind="progress"></slot>
</template>
