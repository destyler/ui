<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelTitleProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../composables/use-floating-panel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelTitle',
})

defineProps<FloatingPanelTitleProps>()
const floatingPanel = useFloatingPanelContext()

useForwardExpose()
</script>

<template>
  <ui.h2 v-bind="floatingPanel.getTitleProps()" :as-child="asChild">
    <slot />
  </ui.h2>
</template>
