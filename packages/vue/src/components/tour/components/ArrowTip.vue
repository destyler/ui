<script lang="ts">

import type { PolymorphicProps } from '~/factory'

export interface TourArrowTipProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TourArrowTip'
})

defineProps<TourArrowTipProps>()
const tour = useTourContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tour.getArrowTipProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
