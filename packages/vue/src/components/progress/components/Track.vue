<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ProgressTrackProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useProgressContext } from '../composables/use-progress-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ProgressTrack',
})

defineProps<ProgressTrackProps>()
const progress = useProgressContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="progress.getTrackProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
