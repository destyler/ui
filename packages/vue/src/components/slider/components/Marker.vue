<script lang="ts">
import type { MarkerProps } from '@destyler/slider'
import type { PolymorphicProps } from '~/factory'

export interface SliderMarkerProps extends MarkerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSliderContext } from '../composables/use-slider-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SliderMarker',
})

const props = defineProps<SliderMarkerProps>()
const slider = useSliderContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="slider.getMarkerProps(props)" :as-child="asChild">
    <slot />
  </ui.span>
</template>
