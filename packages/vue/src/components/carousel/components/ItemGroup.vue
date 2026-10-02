<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselItemGroupProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { ui } from '~/factory'
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
  <ui.div v-bind="mergeProps(carousel.getItemGroupProps(), $attrs)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
