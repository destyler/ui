<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { RootEmits, RootProps } from '../types'

export interface HoverCardRootProps extends RootProps, RenderStrategyProps {}
export interface HoverCardRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { useHoverCard } from '../composables/use-hover-card'
import { HoverCardProvider } from '../composables/use-hover-card-context'

defineOptions({
  name: 'HoverCardRoot',
})

const props = withDefaults(defineProps<HoverCardRootProps>(), {
  defaultOpen: undefined,
  open: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<HoverCardRootEmits>()

const hoverCard = useHoverCard(props, emits)

HoverCardProvider(hoverCard)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
