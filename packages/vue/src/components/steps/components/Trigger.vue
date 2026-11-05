<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useStepsItemPropsContext } from '../composables/use-steps-item-props-context'
import { useForwardExpose } from '~/composables'
import { useStepsTriggerProps } from '../composables/use-steps-trigger-props'

defineOptions({
  name: 'StepsTrigger',
  inheritAttrs: false
})

defineProps<StepsTriggerProps>()

const steps = useStepsContext()
const itemProps = useStepsItemPropsContext()

const getMergedProps = useStepsTriggerProps(() => steps.value.getTriggerProps(itemProps))

useForwardExpose()
</script>

<template>
  <ui.button v-bind="getMergedProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
