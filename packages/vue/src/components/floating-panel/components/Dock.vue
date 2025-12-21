<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FloatingPanelDockProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FloatingPanelDock',
})

defineProps<FloatingPanelDockProps>()

useForwardExpose()
</script>

<template>
  <ui.div data-scope="floating-panel" data-part="dock" :as-child="asChild">
    <slot />
  </ui.div>
</template>
