<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsNextTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useForwardExpose } from '~/composables'
import { useStepsTriggerProps } from '../composables/use-steps-trigger-props'

defineOptions({
  name: 'StepsNextTrigger',
  inheritAttrs: false
})

defineProps<StepsNextTriggerProps>()
const steps = useStepsContext()

const getMergedProps = useStepsTriggerProps(() => steps.value.getNextTriggerProps())

useForwardExpose()
</script>

<template>
  <ui.button v-bind="getMergedProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
