<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RootEmits, RootProps } from '../types'

export interface FloatingPanelRootProps extends RootProps {}
export interface FloatingPanelRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { useFloatingPanel } from '../composables/use-floating-panel'
import { FloatingPanelProvider } from '../composables/use-floating-panel-context'

defineOptions({
  name: 'FloatingPanelRoot',
})

const props = withDefaults(defineProps<FloatingPanelRootProps>(), {
  draggable: undefined,
  resizable: undefined,
  allowOverflow: undefined,
  defaultOpen: undefined,
  disabled: undefined,
  open: undefined,
  lockAspectRatio: undefined,
  closeOnEscape: undefined,
  persistRect: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<FloatingPanelRootEmits>()
const floatingPanel = useFloatingPanel(props, emits)

FloatingPanelProvider(floatingPanel)

useForwardExpose()
</script>

<template>
  <slot />
</template>
