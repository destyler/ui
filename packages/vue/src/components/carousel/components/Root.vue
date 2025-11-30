<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface CarouselRootProps extends RootProps, PolymorphicProps{}
export interface CarouselRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCarousel } from '../composables/use-carousel'
import { CarouselProvider } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

const props = withDefaults(defineProps<CarouselRootProps>(), {
  allowMouseDrag: undefined,
  loop: undefined,
  autoplay: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<CarouselRootEmits>()

const carousel = useCarousel(props, emits)
CarouselProvider(carousel)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="carousel.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
