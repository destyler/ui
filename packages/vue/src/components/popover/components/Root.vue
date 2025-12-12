<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { RootEmits, RootProps } from '../types'

export interface PopoverRootProps extends RootProps, RenderStrategyProps {}
export interface PopoverRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { usePopover } from '../composables/use-popover'
import { PopoverProvider } from '../composables/use-popover-context'

defineOptions({
  name: 'PopoverRoot'
})

const props = withDefaults(defineProps<PopoverRootProps>(), {
  autoFocus: undefined,
  closeOnEscape: undefined,
  closeOnInteractOutside: undefined,
  defaultOpen: undefined,
  modal: undefined,
  open: undefined,
  portalled: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<PopoverRootEmits>()

const popover = usePopover(props, emits)

PopoverProvider(popover)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
