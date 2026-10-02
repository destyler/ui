<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CarouselAutoplayTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { ui } from '~/factory'
import { useCarouselContext } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselAutoplayTrigger',
  inheritAttrs: false
})

defineProps<CarouselAutoplayTriggerProps>()
const carousel = useCarouselContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="mergeProps(carousel.getAutoplayTriggerProps(), $attrs)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
