<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselNextTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselNextTrigger'
})

defineProps<CarouselNextTriggerProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="carousel.getNextTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
