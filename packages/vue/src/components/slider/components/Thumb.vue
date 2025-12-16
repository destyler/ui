<script lang="ts">
import type { ThumbProps } from '@destyler/slider'
import type { PolymorphicProps } from '~/factory'
import { SliderThumbPropsProvider } from '../composables/use-slider-thumb-props-context'

export interface SliderThumbProps extends ThumbProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSliderContext } from '../composables/use-slider-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SliderThumb',
})

const props = defineProps<SliderThumbProps>()
const slider = useSliderContext()

SliderThumbPropsProvider(props)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="slider.getThumbProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
