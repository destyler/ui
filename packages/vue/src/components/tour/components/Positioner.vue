<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TourPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useTourContext } from '../composables/use-tour-context'
import { useRenderStrategyProps, useForwardExpose } from '~/composables'

defineOptions({
  name: 'TourPositioner'
})

defineProps<TourPositionerProps>()

const tour = useTourContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: tour.value.open,
  })),
)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="tour.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
