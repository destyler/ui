<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SliderDraggingIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSliderContext } from '../composables/use-slider-context'
import { useForwardExpose } from '~/composables'
import { useSliderThumbPropsContext } from '../composables/use-slider-thumb-props-context'

defineOptions({
  name: 'SliderDraggingIndicator',
})

defineProps<SliderDraggingIndicatorProps>()
const slider = useSliderContext()
const thumbProps = useSliderThumbPropsContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="slider.getDraggingIndicatorProps(thumbProps)" :as-child="asChild">
    <slot>{{ slots.default?.() || slider.getThumbValue(thumbProps.index) }}</slot>
  </ui.span>
</template>
