<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TourBackdropProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useRenderStrategyProps, useForwardExpose } from '~/composables'
import { Presence } from '~/components/presence'
import { useTourContext } from '../composables/use-tour-context'

defineOptions({
  name: 'TourBackdrop'
})

defineProps<TourBackdropProps>()
const tour = useTourContext()
const renderStrategy = useRenderStrategyProps()

useForwardExpose()
</script>

<template>
  <Presence
    v-if="tour.step?.backdrop"
    v-bind="tour.getBackdropProps()"
    :hidden="!tour.open"
    :present="tour.open"
    :lazy-mount="renderStrategy.lazyMount"
    :unmount-on-exit="renderStrategy.unmountOnExit"
  >
    <slot />
  </Presence>
</template>
