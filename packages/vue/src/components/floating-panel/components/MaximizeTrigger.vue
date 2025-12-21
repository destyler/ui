<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelMaximizeTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelMaximizeTrigger',
})

defineProps<FloatingPanelMaximizeTriggerProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="floatingPanel.getMaximizeTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
