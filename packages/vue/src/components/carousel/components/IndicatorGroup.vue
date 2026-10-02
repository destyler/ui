<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselIndicatorGroupProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselIndicatorGroup',
  inheritAttrs: false
})

defineProps<CarouselIndicatorGroupProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="mergeProps(carousel.getIndicatorGroupProps(), $attrs)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
