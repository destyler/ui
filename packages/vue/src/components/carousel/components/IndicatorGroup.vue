<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselIndicatorGroupProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeCarouselProps } from '../utils/merge-carousel-props'
import { CarouselDiv } from '../utils/carousel-element'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselIndicatorGroup',
  inheritAttrs: false
})

defineProps<CarouselIndicatorGroupProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <CarouselDiv v-bind="mergeCarouselProps(carousel.getIndicatorGroupProps(), $attrs)" :as-child="asChild">
    <slot />
  </CarouselDiv>
</template>
