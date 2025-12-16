<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SliderLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSliderContext } from '../composables/use-slider-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SliderLabel',
})

defineProps<SliderLabelProps>()
const slider = useSliderContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="slider.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
