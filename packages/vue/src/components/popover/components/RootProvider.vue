<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { UsePopoverReturn } from '../composables/use-popover'

interface RootProviderProps {
  value: UnwrapRef<UsePopoverReturn>
}

export interface PopoverRootProviderProps extends RootProviderProps, RenderStrategyProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { PopoverProvider } from '../composables/use-popover-context'

defineOptions({
  name: 'PopoverRootProvider'
})

const props = defineProps<PopoverRootProviderProps>()
const popover = computed(() => props.value)

PopoverProvider(popover)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
