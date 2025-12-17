<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TourTitleProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TourTitle'
})

defineProps<TourTitleProps>()
const tour = useTourContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.h2 v-bind="tour.getTitleProps()" :as-child="asChild">
    <slot>{{ slots.default?.() || tour.step?.title }}</slot>
  </ui.h2>
</template>
