<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useStepsItemPropsContext } from '../composables/use-steps-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsIndicator'
})

defineProps<StepsIndicatorProps>()
const steps = useStepsContext()
const itemProps = useStepsItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="steps.getIndicatorProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
