<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelDragTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelDragTrigger',
})

defineProps<FloatingPanelDragTriggerProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="floatingPanel.getDragTriggerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
