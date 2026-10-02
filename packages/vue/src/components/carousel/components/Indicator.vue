<script lang="ts">
import type { IndicatorProps } from '@destyler/carousel'
import type { PolymorphicProps } from '~/factory'

export interface CarouselIndicatorProps extends IndicatorProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselIndicator',
  inheritAttrs: false
})

const props = defineProps<CarouselIndicatorProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="mergeProps(carousel.getIndicatorProps(props), $attrs)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
