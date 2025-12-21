<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseFloatingPanelContext } from '../composables/use-floating-panel-context'

export interface FloatingPanelContextProps
  extends SlotsType<{
    default: UnwrapRef<UseFloatingPanelContext>
  }> {}
</script>

<script setup lang="ts">
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'

defineOptions({
  name: 'FloatingPanelContext',
})

const floatingPanel = useFloatingPanelContext()

defineSlots<{
  default(floatingPanel: UnwrapRef<UseFloatingPanelContext>): unknown
}>()
</script>

<template>
  <slot v-bind="floatingPanel" />
</template>
