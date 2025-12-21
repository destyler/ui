<script lang="ts">
import type { ResizeTriggerAxis } from '@destyler/floating-panel'
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelResizeTriggerProps extends PolymorphicProps {
  /**
   * The axis for resizing
   */
  axis: ResizeTriggerAxis
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelResizeTrigger',
})

const props = defineProps<FloatingPanelResizeTriggerProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="floatingPanel.getResizeTriggerProps({ axis: props.axis })" :as-child="asChild">
    <slot />
  </ui.div>
</template>
