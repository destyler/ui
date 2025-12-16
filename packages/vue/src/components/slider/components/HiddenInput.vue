<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SliderHiddenInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSliderContext } from '../composables/use-slider-context'
import { useSliderThumbPropsContext } from '../composables/use-slider-thumb-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SliderHiddenInput',
})

defineProps<SliderHiddenInputProps>()

const slider = useSliderContext()
const thumbProps = useSliderThumbPropsContext()

useForwardExpose()
</script>

<template>
  <ui.input v-bind="slider.getHiddenInputProps(thumbProps)" :as-child="asChild">
    <slot />
  </ui.input>
</template>
