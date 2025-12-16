<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsSeparatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useStepsItemPropsContext } from '../composables/use-steps-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsSeparator'
})

defineProps<StepsSeparatorProps>()

const steps = useStepsContext()
const itemProps = useStepsItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="steps.getSeparatorProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
