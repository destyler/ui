<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelHeaderProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelHeader',
})

defineProps<FloatingPanelHeaderProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="floatingPanel.getHeaderProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
