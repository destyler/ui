<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { RootEmits, RootProps } from '../types'

export interface TooltipRootProps extends RootProps, RenderStrategyProps {}
export interface TooltipRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { useTooltip } from '../composables/use-tooltip'
import { TooltipProvider } from '../composables/use-tooltip-context'

defineOptions({
  name: 'TooltipRoot'
})

const props = withDefaults(defineProps<TooltipRootProps>(), {
  closeOnClick: undefined,
  closeOnEscape: undefined,
  closeOnPointerDown: undefined,
  closeOnScroll: undefined,
  defaultOpen: undefined,
  disabled: undefined,
  interactive: undefined,
  open: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<TooltipRootEmits>()

const tooltip = useTooltip(props, emits)

TooltipProvider(tooltip)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
