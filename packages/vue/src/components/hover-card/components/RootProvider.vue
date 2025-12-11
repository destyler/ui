<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { UseHoverCardReturn } from '../composables/use-hover-card'

interface RootProviderProps {
  value: UnwrapRef<UseHoverCardReturn>
}

export interface HoverCardRootProviderProps extends RootProviderProps, RenderStrategyProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { HoverCardProvider } from '../composables/use-hover-card-context'

defineOptions({
  name: 'HoverCardRootProvider',
})

const props = defineProps<HoverCardRootProviderProps>()
const hoverCard = computed(() => props.value)

HoverCardProvider(hoverCard)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
