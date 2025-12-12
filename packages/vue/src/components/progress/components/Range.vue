<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ProgressRangeProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useProgressContext } from '../composables/use-progress-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ProgressRange',
})

defineProps<ProgressRangeProps>()
const progress = useProgressContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="progress.getRangeProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
