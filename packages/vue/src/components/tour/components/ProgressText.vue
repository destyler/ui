<script lang="ts">

import type { PolymorphicProps } from '~/factory'

export interface TourProgressTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TourProgressText'
})

defineProps<TourProgressTextProps>()
const tour = useTourContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tour.getProgressTextProps()" :as-child="asChild">
    <slot>{{ slots.default?.() || tour.getProgressText() }}</slot>
  </ui.div>
</template>
