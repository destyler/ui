<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ProgressCircleProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useProgressContext } from '../composables/use-progress-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ProgressCircle',
})

defineProps<ProgressCircleProps>()
const progress = useProgressContext()

useForwardExpose()
</script>

<template>
  <ui.svg v-bind="progress.getCircleProps()" :as-child="asChild">
    <slot />
  </ui.svg>
</template>
