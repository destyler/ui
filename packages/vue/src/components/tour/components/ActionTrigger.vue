<script lang="ts">
import type { StepActionTriggerProps } from '@destyler/tour'

import type { PolymorphicProps } from '~/factory'

export interface TourActionTriggerProps extends StepActionTriggerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TourActionTrigger'
})

const props = defineProps<TourActionTriggerProps>()
const tour = useTourContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="tour.getActionTriggerProps(props)" :as-child="asChild">
    <slot>{{ slots.default?.() || props.action.label }}</slot>
  </ui.button>
</template>
