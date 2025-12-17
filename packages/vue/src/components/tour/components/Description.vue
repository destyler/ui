<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TourDescriptionProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TourDescription'
})

defineProps<TourDescriptionProps>()
const tour = useTourContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tour.getDescriptionProps()" :as-child="asChild">
    <slot>{{ slots.default?.() || tour.step?.title }}</slot>
  </ui.div>
</template>
