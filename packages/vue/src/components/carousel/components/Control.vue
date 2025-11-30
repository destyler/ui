<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'

export interface CarouselControlProps extends PolymorphicProps{}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useForwardExpose } from '~/composables'

defineProps<CarouselControlProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="carousel.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
