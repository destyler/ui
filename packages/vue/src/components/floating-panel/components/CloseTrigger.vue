<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelCloseTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelCloseTrigger',
})

defineProps<FloatingPanelCloseTriggerProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="floatingPanel.getCloseTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
