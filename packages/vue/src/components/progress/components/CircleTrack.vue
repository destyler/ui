<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ProgressCircleTrackProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useProgressContext } from '../composables/use-progress-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ProgressCircleTrack',
})

defineProps<ProgressCircleTrackProps>()
const progress = useProgressContext()

useForwardExpose()
</script>

<template>
  <ui.circle v-bind="progress.getCircleTrackProps()" :as-child="asChild">
    <slot />
  </ui.circle>
</template>
