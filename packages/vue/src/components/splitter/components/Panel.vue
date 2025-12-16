<script lang="ts">
import type { PanelProps } from '@destyler/splitter'
import type { PolymorphicProps } from '~/factory'

export interface SplitterPanelProps extends PanelProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSplitterContext } from '../composables/use-splitter-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SplitterPanel'
})

const props = defineProps<SplitterPanelProps>()
const splitter = useSplitterContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="splitter.getPanelProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
