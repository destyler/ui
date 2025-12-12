<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ProgressLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useProgressContext } from '../composables/use-progress-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ProgressLabel',
})

defineProps<ProgressLabelProps>()
const progress = useProgressContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="progress.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
