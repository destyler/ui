<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselItemGroupProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeCarouselProps } from '../utils/merge-carousel-props'
import { CarouselDiv } from '../utils/carousel-element'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselItemGroup',
  inheritAttrs: false
})

defineProps<CarouselItemGroupProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <CarouselDiv v-bind="mergeCarouselProps(carousel.getItemGroupProps(), $attrs)" :as-child="asChild">
    <slot />
  </CarouselDiv>
</template>
