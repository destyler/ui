<script lang="ts">
import type { ResizeTriggerProps } from '@destyler/splitter'
import type { PolymorphicProps } from '~/factory'

export interface SplitterResizeTriggerProps extends ResizeTriggerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSplitterContext } from '../composables/use-splitter-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SplitterResizeTrigger'
})

const props = defineProps<SplitterResizeTriggerProps>()
const splitter = useSplitterContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="splitter.getResizeTriggerProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
