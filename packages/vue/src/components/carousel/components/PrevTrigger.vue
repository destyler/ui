<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselPrevTriggerProps extends PolymorphicProps{}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineProps<CarouselPrevTriggerProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="carousel.getPrevTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
