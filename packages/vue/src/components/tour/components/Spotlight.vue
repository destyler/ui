<script lang="ts">
import { type HTMLAttributes } from 'vue'
import type { PolymorphicProps } from '~/factory'

export interface TourSpotlightBaseProps extends PolymorphicProps {}
export interface TourSpotlightProps
  extends TourSpotlightBaseProps,
    /**
     * @vue-ignore
     */
    HTMLAttributes {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed } from 'vue'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'
import { useRenderStrategyProps } from '~/composables'

defineOptions({
  name: 'TourSpotlight'
})

defineProps<TourSpotlightProps>()

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
  <ui.div
    v-if="!presence.unmounted"
    v-bind="tour.getSpotlightProps()"
    :hidden="!tour.open || !tour.step?.target?.()"
    :as-child="asChild"
  >
    <slot />
  </ui.div>
</template>
