<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsProgressProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsProgress'
})

defineProps<StepsProgressProps>()
const steps = useStepsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="steps.getProgressProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
