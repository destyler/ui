<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseAspectRatioContext } from '../composables/use-aspect-ratio-context'

export interface AspectRatioContextProps
  extends SlotsType<{
    default: UnwrapRef<UseAspectRatioContext>
  }> {}
</script>

<script setup lang="ts">
import { useAspectRatioContext } from '../composables/use-aspect-ratio-context'

defineOptions({
  name: 'AspectRatioContext',
})

const aspectRatio = useAspectRatioContext()

defineSlots<{
  default(aspectRatio: UnwrapRef<UseAspectRatioContext>): unknown
}>()
</script>

<template>
  <slot v-bind="aspectRatio"></slot>
</template>
