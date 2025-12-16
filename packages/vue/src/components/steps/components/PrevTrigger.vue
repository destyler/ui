<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsPrevTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsPrevTrigger'
})

defineProps<StepsPrevTriggerProps>()
const steps = useStepsContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="steps.getPrevTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
