<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselItemGroupProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineProps<CarouselItemGroupProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="carousel.getItemGroupProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
