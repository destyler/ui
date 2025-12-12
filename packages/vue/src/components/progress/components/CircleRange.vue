<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ProgressCircleRangeProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useProgressContext } from '../composables/use-progress-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ProgressCircleRange',
})

defineProps<ProgressCircleRangeProps>()
const progress = useProgressContext()

useForwardExpose()
</script>

<template>
  <ui.circle v-bind="progress.getCircleRangeProps()" :as-child="asChild">
    <slot />
  </ui.circle>
</template>
