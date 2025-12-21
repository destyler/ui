<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelMinimizeTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelMinimizeTrigger',
})

defineProps<FloatingPanelMinimizeTriggerProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="floatingPanel.getMinimizeTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
