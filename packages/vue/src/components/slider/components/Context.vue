<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseSliderContext } from '../composables/use-slider-context'

export interface SliderContextProps
  extends SlotsType<{
    default: UnwrapRef<UseSliderContext>
  }> {}
</script>

<script setup lang="ts">
import { useSliderContext } from '../composables/use-slider-context'

defineOptions({
  name: 'SliderContext',
})

const slider = useSliderContext()

defineSlots<{
  default(slider: UnwrapRef<UseSliderContext>): unknown
}>()
</script>

<template>
  <slot v-bind="slider"></slot>
</template>
