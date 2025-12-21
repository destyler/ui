<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelPositioner',
})

defineProps<FloatingPanelPositionerProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="floatingPanel.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
