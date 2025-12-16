<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SliderTrackProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSliderContext } from '../composables/use-slider-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SliderTrack',
})

defineProps<SliderTrackProps>()
const slider = useSliderContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="slider.getTrackProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
