<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselNextTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeCarouselProps } from '../utils/merge-carousel-props'
import { CarouselButton } from '../utils/carousel-element'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselNextTrigger',
  inheritAttrs: false
})

defineProps<CarouselNextTriggerProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <CarouselButton v-bind="mergeCarouselProps(carousel.getNextTriggerProps(), $attrs)" :as-child="asChild">
    <slot />
  </CarouselButton>
</template>
