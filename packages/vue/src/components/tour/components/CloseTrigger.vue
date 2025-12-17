<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TourCloseTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TourCloseTrigger'
})

defineProps<TourCloseTriggerProps>()
const tour = useTourContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="tour.getCloseTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
