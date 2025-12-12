<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface ProgressRootProps extends RootProps, PolymorphicProps {}
export interface ProgressRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useProgress } from '../composables/use-progress'
import { ProgressProvider } from '../composables/use-progress-context'

defineOptions({
  name: 'ProgressRoot',
})

const props = defineProps<ProgressRootProps>()
const progress = useProgress(props)

ProgressProvider(progress)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="progress.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
