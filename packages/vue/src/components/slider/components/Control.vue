<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SliderControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSliderContext } from '../composables/use-slider-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SliderControl',
})

defineProps<SliderControlProps>()
const slider = useSliderContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="slider.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
