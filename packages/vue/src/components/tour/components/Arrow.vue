<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TourArrowProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TourArrow'
})

defineProps<TourArrowProps>()
const tour = useTourContext()

useForwardExpose()
</script>

<template>
  <ui.div v-if="tour.step?.arrow" v-bind="tour.getArrowProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
