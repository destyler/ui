<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselAutoplayTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselAutoplayTrigger'
})

defineProps<CarouselAutoplayTriggerProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="carousel.getAutoplayTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
