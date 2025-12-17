<script lang="ts">
import type { RenderStrategyProps } from '~/composables'
import type { RootEmits } from '../types'
import type { UseTourReturn } from '../composables/use-tour'

interface RootProps {
  tour: UnwrapRef<UseTourReturn>
}

export interface TourRootProps extends RootProps, RenderStrategyProps {}
export interface TourRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed, type UnwrapRef } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { TourProvider } from '../composables/use-tour-context'

defineOptions({
  name: 'TourRoot'
})

const props = defineProps<TourRootProps>()
const tour = computed(() => props.tour)

TourProvider(tour)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
