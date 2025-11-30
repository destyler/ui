<script lang="ts">
import type { ItemProps } from '@destyler/carousel'
import type { PolymorphicProps } from '~/factory'

export interface CarouselItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselItem'
})

const props = defineProps<CarouselItemProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="carousel.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
