<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelTrigger',
})

defineProps<FloatingPanelTriggerProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="floatingPanel.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
