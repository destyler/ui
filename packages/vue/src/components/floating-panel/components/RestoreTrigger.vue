<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelRestoreTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelRestoreTrigger',
})

defineProps<FloatingPanelRestoreTriggerProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="floatingPanel.getRestoreTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
