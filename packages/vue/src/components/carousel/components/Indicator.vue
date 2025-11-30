<script lang="ts">
import type { IndicatorProps } from '@destyler/carousel'
import type { PolymorphicProps } from '~/factory'

export interface CarouselIndicatorProps extends IndicatorProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselIndicator'
})

const props = defineProps<CarouselIndicatorProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="carousel.getIndicatorProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
