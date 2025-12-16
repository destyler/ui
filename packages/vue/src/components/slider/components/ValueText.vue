<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SliderValueTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useSliderContext } from '../composables/use-slider-context'

defineOptions({
  name: 'SliderValueText',
})

defineProps<SliderValueTextProps>()
const slider = useSliderContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="slider.getValueTextProps()" :as-child="asChild">
    <slot>{{ slots.default?.() || slider.value.join(', ') }}</slot>
  </ui.span>
</template>
