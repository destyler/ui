<script lang="ts">
import type { ViewProps } from '@destyler/progress'
import type { PolymorphicProps } from '~/factory'

export interface ProgressViewProps extends ViewProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useProgressContext } from '../composables/use-progress-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ProgressView',
})

const props = defineProps<ProgressViewProps>()
const progress = useProgressContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="progress.getViewProps(props)" :as-child="asChild">
    <slot />
  </ui.span>
</template>
