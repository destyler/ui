<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsNextTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsNextTrigger'
})

defineProps<StepsNextTriggerProps>()
const steps = useStepsContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="steps.getNextTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
