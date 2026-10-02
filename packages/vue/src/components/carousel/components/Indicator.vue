<script lang="ts">
import type { IndicatorProps } from '@destyler/carousel'
import type { PolymorphicProps } from '~/factory'

export interface CarouselIndicatorProps extends IndicatorProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeCarouselProps } from '../utils/merge-carousel-props'
import { CarouselButton } from '../utils/carousel-element'
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
  <CarouselButton v-bind="mergeCarouselProps(carousel.getIndicatorProps(props), $attrs)" :as-child="asChild">
    <slot />
  </CarouselButton>
</template>
