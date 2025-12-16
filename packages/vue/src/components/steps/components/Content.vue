<script lang="ts">
import type { ItemProps } from '@destyler/steps'
import type { PolymorphicProps } from '~/factory'

export interface StepsContentProps extends PolymorphicProps, ItemProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsContent'
})

const itemProps = defineProps<StepsContentProps>()
const steps = useStepsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="steps.getContentProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
