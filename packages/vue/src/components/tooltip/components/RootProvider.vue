<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { UseTooltipReturn } from '../composables/use-tooltip'

interface RootProviderProps {
  value: UnwrapRef<UseTooltipReturn>
}
export interface TooltipRootProviderProps extends RootProviderProps, RenderStrategyProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { TooltipProvider } from '../composables/use-tooltip-context'

defineOptions({
  name: 'TooltipRootProvider'
})

const props = defineProps<TooltipRootProviderProps>()
const tooltip = computed(() => props.value)

TooltipProvider(tooltip)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
