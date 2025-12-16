<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useStepsItemPropsContext } from '../composables/use-steps-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsTrigger'
})

defineProps<StepsTriggerProps>()

const steps = useStepsContext()
const itemProps = useStepsItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="steps.getTriggerProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
